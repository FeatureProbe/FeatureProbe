package com.featureprobe.api.analysis

import com.github.michaelbull.result.Err
import com.github.michaelbull.result.Ok
import com.github.michaelbull.result.Result
import kotliquery.HikariCP
import kotliquery.queryOf
import kotliquery.sessionOf
import org.apache.commons.math3.distribution.BetaDistribution
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.*
import java.sql.PreparedStatement
import java.sql.Timestamp
import javax.sql.DataSource

@RestController
class AnalysisController(val service: AnalysisService) {

    @PostMapping("/events")
    fun storeEvents(
        @RequestHeader(value = "Authorization") sdkKey: String,
        @RequestBody request: EventRequest
    ): EventResponse {
        service.storeEvents(request, sdkKey)
        return EventResponse(200)
    }

    @GetMapping("/analysis")
    fun getAnalysis(
        @RequestHeader(value = "Authorization") sdkKey: String,
        @RequestParam metric: String,
        @RequestParam toggle: String,
        @RequestParam type: String,
        @RequestParam version: String,
        @RequestParam start: Timestamp,
        @RequestParam end: Timestamp,
    ): AnalysisResponse {
        return when (service.doAnalysis(sdkKey, metric, toggle, type, version, start, end)) {
            Err(NotSupportAnalysisType) -> AnalysisResponse(500)
            else -> AnalysisResponse(200)
        }
    }

}

@Service
class AnalysisService(
    @Value("\${app.datasource.jdbc-url}") val url: String,
    @Value("\${app.datasource.username}") val user: String,
    @Value("\${app.datasource.password}") val password: String,
    @Value("\${app.iterations") val iterationCount: Int = 10000,
) {

    val log: Logger = LoggerFactory.getLogger("AnalyzeService")

    val dataSource: DataSource by lazy {
        HikariCP.default(url, user, password)
        HikariCP.dataSource()
    }

    fun storeEvents(request: EventRequest, sdkKey: String) {
        log.debug("storeEvents $sdkKey $request")
        val session = sessionOf(dataSource)

        // execute prepared statement is more efficient than execute insert query every time
        val accessPrepStmt = session.createPreparedStatement(queryOf(INSERT_ACCESS_SQL))
        val customPrepStmt = session.createPreparedStatement(queryOf(INSERT_CUSTOM_SQL))

        // access_events should add unique index for (user_key, toggle_key, version)
        request.events.forEach {
            when (it) {
                is AccessEvent -> batchAddAccessEvent(accessPrepStmt, it, sdkKey)
                is CustomEvent -> batchAddCustomEvent(customPrepStmt, it, sdkKey)
            }

            accessPrepStmt.executeLargeBatch()
            customPrepStmt.executeLargeBatch()
        }

    }

    fun doAnalysis(
        sdkKey: String, metric: String, toggle: String, type: String,
        version: String, start: Timestamp, end: Timestamp
    ): Result<AnalysisReport, AnalysisFailure> {
        if (type != "binomial") {
            return Err(NotSupportAnalysisType)
        }

        val variationCount = variationCount(metric, toggle, start, end)

        val distributions = variationCount.associate {
            it.variation to BetaDistribution(1.0 + it.convert, 1.0 + it.all - it.convert)
        }

        val ctw = chanceToWin(distributions, iterationCount)

        return Ok(AnalysisReport(ctw))
    }

    fun variationCount(metric: String, toggle: String, start: Timestamp, end: Timestamp): List<VariationCount> {
        val session = sessionOf(dataSource)

        return session.run(
            queryOf(statsSql(metric, toggle, start, end))
                .map { row ->
                    VariationCount(row.string("variation"), row.int("cvt"), row.int("total"))
                }.asList
        )
    }

}


