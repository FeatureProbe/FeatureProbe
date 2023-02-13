package com.featureprobe.api.analysis

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import com.github.michaelbull.result.get
import kotliquery.HikariCP
import kotliquery.queryOf
import kotliquery.sessionOf
import org.apache.commons.math3.distribution.BetaDistribution
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import java.sql.Timestamp
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
        @RequestParam metric: String,
        @RequestParam toggle: String,
        @RequestParam type: String,
        @RequestParam start: Long,
        @RequestParam end: Long,
    ): AnalysisResponse {
        return when (val result = service.doAnalysis(sdkKey, metric, toggle, type, start, end)) {
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
    @Value("\${app.hikari.idle-timeout}") val hikariIdleTimeout: Long = 60000,
    @Value("\${app.hikari.max-lifetime}") val hikariMaxLifetime: Long = 30000,
    @Value("\${app.hikari.connection-timeout}") val hikariConnectTimeOut: Long = 30000,
    @Value("\${app.hikari.connection-test-query}") val hikariTtestQuery: String = "SELECT 1",
) {

    val log: Logger = LoggerFactory.getLogger("AnalyzeService")

    val dataSource: DataSource by lazy {
        HikariCP.init("default", url, user, password) {
            this.maximumPoolSize = hikariMaxPool
            this.connectionTimeout = hikariConnectTimeOut
            this.idleTimeout = hikariIdleTimeout
            this.minimumIdle = hikariMinIdle
            this.maxLifetime = hikariMaxLifetime
            this.connectionTestQuery = hikariTtestQuery
        }
        HikariCP.dataSource()
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
        type: String, start: Long, end: Long
    ): Result<Map<String, VariationProperty>, AnalysisFailure> {
        if (type != "binomial") {
            return Err(NotSupportAnalysisType)
        }

        val variationCount = variationCount(metric, toggle, start, end)

        val distributions = variationCount.associate {
            it.variation to BetaDistribution(1.0 + it.convert, 1.0 + it.all - it.convert)
        }

        return Ok(variationStats(distributions, winningPercentage(distributions, iterationCount)))
    }

    fun variationCount(metric: String, toggle: String, start: Long, end: Long): List<VariationCount> {
        val sql = statsSql(metric, toggle, start, end)
        log.info(sql)
        val session = sessionOf(dataSource)
        session.use {
            return session.run(
                queryOf(sql)
                    .map { row ->
                        VariationCount(row.string("variation"), row.int("cvt"), row.int("total"))
                    }.asList
            )
        }
    }

}


