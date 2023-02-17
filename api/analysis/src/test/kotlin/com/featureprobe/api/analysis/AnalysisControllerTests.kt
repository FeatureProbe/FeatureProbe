package com.featureprobe.api.analysis

import com.github.michaelbull.result.*
import kotliquery.queryOf
import kotliquery.sessionOf
import org.junit.Assert
import org.junit.ClassRule
import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.utility.DockerImageName

// for mac with M1/M2 chips:  docker pull arm64v8/mysql:8.0
// for mac with M1/M2 chips:  docker pull arm64v8/postgres:14.6
@SpringBootTest
class AnalysisControllerTests {

    companion object {
        @ClassRule
        @JvmField
        val mysql: MySQLContainer<*> = MySQLContainer(DockerImageName.parse("mysql:8.0"))
            .withDatabaseName("feature_probe_events")
            .withInitScript("init.sql")
            .withUsername("root")
            .withPassword("root")

        @ClassRule
        @JvmField
        val pg: PostgreSQLContainer<*> = PostgreSQLContainer(DockerImageName.parse("postgres:14.6"))
            .withDatabaseName("feature_probe_events")
            .withInitScript("init.sql")
            .withUsername("root")
            .withPassword("root")
    }

    @Test
    fun testStoreEventsMysql() {
        testStoreEvents(mysql.jdbcUrl)
    }

    @Test
    fun testStoreEventsPg() {
        testStoreEvents(pg.jdbcUrl)
    }

    fun testStoreEvents(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val access0 = AccessEvent(1676273668, "user0", "testStoreEventsToggle", 1, 1, 1)
        val access1 = AccessEvent(1676273668, "user1", "testStoreEventsToggle", 1, null, null)
        val event0 = CustomEvent(1676273668, "user0", "testStoreClick", 1.0)
        val event1 = CustomEvent(1676273668, "user1", "testStoreClick", 1.0)
        val req = EventRequest(arrayListOf(access0, access1, event0, event1))
        val session = sessionOf(service.dataSource)

        session.run(queryOf("BEGIN").asExecute)

        service.storeEvents(req, "sdk_key")
        val accessEventCount: List<Int> = session.run(
            queryOf("SELECT count(*) as c FROM access WHERE toggle_key = 'testStoreEventsToggle'")
                .map { row -> row.int("c") }.asList
        )
        val customEventCount: List<Int> = session.run(
            queryOf("SELECT count(*) as c FROM events WHERE name = 'testStoreClick'")
                .map { row -> row.int("c") }.asList
        )

        assert(accessEventCount == arrayListOf(2))
        assert(customEventCount == arrayListOf(2))

        session.run(queryOf("ROLLBACK").asExecute)
    }

    @Test
    fun testConversionAnalysisMysql() {
        testConversionAnalysis(mysql.jdbcUrl)
    }

    @Test
    fun testConversionAnalysisPg() {
        testConversionAnalysis(pg.jdbcUrl)
    }

    @Test
    fun testVariationEmptyConversionAnalysisMysql() {
        testVariationEmptyConversionAnalysis(mysql.jdbcUrl)
    }

    @Test
    fun testVariationEmptyConversionAnalysisPg() {
        testVariationEmptyConversionAnalysis(pg.jdbcUrl)
    }

    @Test
    fun testEventEmptyConversionAnalysisMysql() {
        testEventEmptyConversionAnalysis(mysql.jdbcUrl)
    }

    @Test
    fun testEventEmptyConversionAnalysisPg() {
        testEventEmptyConversionAnalysis(pg.jdbcUrl)
    }

    fun testConversionAnalysis(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273678L

        val result =
            service.doAnalysis("sdk_key", "click_1", "toggle_1", "binomial", start, end)

        Assert.assertNotNull(result.get())
        Assert.assertNotNull(result.get()!!["1"])
        Assert.assertNotNull(result.get()!!["2"])

    }

    fun testVariationEmptyConversionAnalysis(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273669L

        val result =
            service.doAnalysis("sdk_key", "click_not_collect", "toggle_not_collect", "binomial", start, end)

        Assert.assertNotNull(result.get())
        Assert.assertTrue(result.get()!!.isEmpty())
    }

    fun testEventEmptyConversionAnalysis(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273669L

        val result =
            service.doAnalysis("sdk_key", "click_not_collect", "toggle_1", "binomial", start, end)

        Assert.assertNotNull(result.get())
        Assert.assertTrue(result.get()!!.isEmpty())
    }

}
