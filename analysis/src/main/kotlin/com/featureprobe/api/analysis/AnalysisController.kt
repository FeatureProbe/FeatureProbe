package com.featureprobe.api.analysis

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.get
import kotliquery.HikariCP
import kotliquery.queryOf
import kotliquery.sessionOf
import org.apache.commons.math3.distribution.BetaDistribution
import org.apache.commons.math3.distribution.NormalDistribution
import org.flywaydb.core.Flyway
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import javax.annotation.PostConstruct
import javax.sql.DataSource


@RestController
class AnalysisController(val service: AnalysisService) {

    @PostMapping("/events")
    fun storeEvents(
        @RequestHeader(value = "Authorization") sdkKey: String,
        @RequestBody body: List<EventRequest>
    ): EventResponse {
        body.forEach {
            service.storeEvents(it, sdkKey)
        }
        return EventResponse(200)
    }

    @GetMapping("/analysis")
    fun getAnalysis(
        @RequestHeader(value = "Authorization") sdkKey: String,
        @RequestParam toggle: String,
        @RequestParam metric: String,
        @RequestParam type: String,
        @RequestParam start: Long,
        @RequestParam end: Long,
        @RequestParam positiveWin: Boolean = true
    ): AnalysisResponse {
        return when (val result = service.doAnalysis(sdkKey, metric, toggle, type, start, end, positiveWin)) {
            Err(NotSupportAnalysisType) -> AnalysisResponse(500, mapOf())
            else -> AnalysisResponse(200, result.get())
        }
    }
}

@Service
class AnalysisService(
    @Value("\${app.datasource.jdbcUrl}") val url: String,
    @Value("\${app.datasource.username}") val user: String,
    @Value("\${app.datasource.password}") val password: String,
    @Value("\${app.analysis.iterations}") val iterationCount: Int = 1000,
    @Value("\${app.hikari.minimum-idle}") val hikariMinIdle: Int = 10,
    @Value("\${app.hikari.maximum-pool-size}") val hikariMaxPool: Int = 100,
    @Value("\${app.hikari.idle-timeout}") val hikariIdleTimeout: Long = 30000,
    @Value("\${app.hikari.max-lifetime}") val hikariMaxLifetime: Long = 60000,
    @Value("\${app.hikari.connection-timeout}") val hikariConnectTimeOut: Long = 30000,
    @Value("\${app.hikari.connection-test-query}") val hikariTestQuery: String = "SELECT 1",
    @Value("\${flyway.enabled}") val flywayEnabled: Boolean = false
) {

    val log: Logger = LoggerFactory.getLogger("AnalyzeService")

    val dataSource: DataSource by lazy {
        HikariCP.init("default", url, user, password) {
            this.maximumPoolSize = hikariMaxPool
            this.connectionTimeout = hikariConnectTimeOut
            this.idleTimeout = hikariIdleTimeout
            this.minimumIdle = hikariMinIdle
            this.maxLifetime = hikariMaxLifetime
            this.connectionTestQuery = hikariTestQuery
        }
        HikariCP.dataSource()
    }

    @PostConstruct
    fun init() {
        if (flywayEnabled) {
            val flyway: Flyway = Flyway.configure().dataSource(url, user, password).load()
            flyway.migrate()
        }
    }

    fun storeEvents(request: EventRequest, sdkKey: String) {
        log.debug("storeEvents $sdkKey $request")
        val session = sessionOf(dataSource)
        session.use {
            // execute prepared statement is more efficient than execute insert query every time
            val variationPrepStmt = session.createPreparedStatement(queryOf(INSERT_VARIATION_SQL))
            val eventPrepStmt = session.createPreparedStatement(queryOf(INSERT_EVENT_SQL))

            // access_events should add unique index for (user_key, toggle_key)
            request.events.forEach {
                when (it) {
                    is AccessEvent -> batchAddVariation(variationPrepStmt, it, sdkKey)
                    is CustomEvent -> batchAddEvent(eventPrepStmt, it, sdkKey)
                }
            }

            variationPrepStmt.executeLargeBatch()
            eventPrepStmt.executeLargeBatch()
        }
    }

    fun doAnalysis(
        sdkKey: String, metric: String, toggle: String,
        type: String, start: Long, end: Long,
        positiveWin: Boolean = true
    ): Result<Map<String, VariationProperty>, AnalysisFailure> {
        return when (type) {
            "binomial" -> doAnalysisBinomial(sdkKey, metric, toggle, start, end, positiveWin)
            "gaussian" -> doAnalysisGaussian(sdkKey, metric, toggle, start, end, positiveWin)
            else -> Err(NotSupportAnalysisType)
        }
    }

    fun doAnalysisBinomial(
        sdkKey: String, metric: String, toggle: String,
        start: Long, end: Long, positiveWin: Boolean
    ): Result<Map<String, VariationProperty>, AnalysisFailure> {
        val variationCount = binomialSqlExecute(sdkKey, metric, toggle, start, end)

        val distributions = variationCount.associate {
            it.variation to BetaDistributionInfo(
                BetaDistribution(1.0 + it.convert, 1.0 + it.sampleSize - it.convert),
                it.convert,
                it.sampleSize
            )
        }

        return Ok(binomialVariationStats(distributions, iterationCount, true))
    }

    fun doAnalysisGaussian(
        sdkKey: String, metric: String, toggle: String, start: Long, end: Long, positiveWin: Boolean
    ): Result<Map<String, VariationProperty>, AnalysisFailure> {
        val variationGaussian = gaussianSqlExecute(sdkKey, metric, toggle, start, end)
        val distributions = variationGaussian.associate {
            it.variation to GaussianDistributionInfo(
                NormalDistribution(it.mean, it.stdDeviation),
                it.mean,
                it.stdDeviation,
                it.sampleSize
            )
        }

        return Ok(gaussianVariationStats(distributions, iterationCount, positiveWin))
    }

    fun binomialSqlExecute(
        sdkKey: String,
        metric: String,
        toggle: String,
        start: Long,
        end: Long
    ): List<VariationConvert> {
        val sql = binomialStatsSql(sdkKey, metric, toggle, start, end)
        log.info(sql)
        val session = sessionOf(dataSource)
        session.use {
            return session.run(
                queryOf(sql)
                    .map { row ->
                        VariationConvert(row.string("variation"), row.int("cvt"), row.int("total"))
                    }.asList
            )
        }
    }

    fun gaussianSqlExecute(
        sdkKey: String,
        metric: String,
        toggle: String,
        start: Long,
        end: Long
    ): List<VariationGaussian> {
        val sql = gaussianStatsSql(sdkKey, metric, toggle, start, end)
        log.info(sql)
        val session = sessionOf(dataSource)
        session.use {
            return session.run(
                queryOf(sql)
                    .map { row ->
                        VariationGaussian(
                            row.string("variation"),
                            row.double("mean"),
                            row.double("std_deviation"),
                            row.int("count")
                        )
                    }.asList
            )
        }
    }

}


