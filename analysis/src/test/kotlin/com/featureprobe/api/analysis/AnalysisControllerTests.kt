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
        testStoreNullCustomEvents(mysql.jdbcUrl)
    }

    @Test
    fun testStoreEventsPg() {
        testStoreEvents(pg.jdbcUrl)
        testStoreNullCustomEvents(pg.jdbcUrl)
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

    fun testStoreNullCustomEvents(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val event0 = CustomEvent(1676273668, "user0", "testStoreClickNoValue", null)
        val event1 = CustomEvent(1676273668, "user1", "testStoreClickNoValue", null)
        val req = EventRequest(arrayListOf(event0, event1))
        val session = sessionOf(service.dataSource)

        session.run(queryOf("BEGIN").asExecute)

        service.storeEvents(req, "sdk_key")

        val customEventCount: List<Int> = session.run(
            queryOf("SELECT count(*) as c FROM events WHERE name = 'testStoreClickNoValue'")
                .map { row -> row.int("c") }.asList
        )

        assert(customEventCount == arrayListOf(2))

        session.run(queryOf("ROLLBACK").asExecute)
    }

    @Test
    fun testBinomialAnalysisMysql() {
        testBinomialAnalysis(mysql.jdbcUrl)
    }

    @Test
    fun testBinomialAnalysisPg() {
        testBinomialAnalysis(pg.jdbcUrl)
    }

    @Test
    fun testVariationEmptyBinomialAnalysisMysql() {
        testVariationEmptyAnalysis(mysql.jdbcUrl, "binomial")
    }

    @Test
    fun testVariationEmptyBinomialAnalysisPg() {
        testVariationEmptyAnalysis(pg.jdbcUrl, "binomial")
    }

    @Test
    fun testEventEmptyBinomialAnalysisMysql() {
        testEventEmptyAnalysis(mysql.jdbcUrl, "binomial")
    }

    @Test
    fun testEventEmptyBinomialAnalysisPg() {
        testEventEmptyAnalysis(pg.jdbcUrl, "binomial")
    }

    @Test
    fun testGaussianAnalysisMysql() {
        testGaussianAnalysis(mysql.jdbcUrl)
    }

    @Test
    fun testGaussianAnalysisPg() {
        testGaussianAnalysis(pg.jdbcUrl)
    }

    @Test
    fun testVariationEmptyGaussianAnalysisMysql() {
        testVariationEmptyAnalysis(mysql.jdbcUrl, "gaussian")
    }

    @Test
    fun testVariationEmptyGaussianAnalysisPg() {
        testVariationEmptyAnalysis(pg.jdbcUrl, "gaussian")
    }

    @Test
    fun testEventEmptyGaussianAnalysisMysql() {
        testEventEmptyAnalysis(mysql.jdbcUrl, "gaussian")
    }

    @Test
    fun testEventEmptyGaussianAnalysisPg() {
        testEventEmptyAnalysis(pg.jdbcUrl, "gaussian")
    }

    fun testBinomialAnalysis(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273678L

        val result =
            service.doAnalysis("sdk_key", "click_1", "toggle_1", "binomial", start, end)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(3, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(0.6, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(0.64, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(2, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(0.5, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(0.36, result.get()!!["2"]?.winningPercentage!!, 0.1)
    }

    fun testVariationEmptyAnalysis(jdbcUrl: String, type: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273669L

        val result =
            service.doAnalysis("sdk_key", "click_not_collect", "toggle_not_collect", type, start, end)

        Assert.assertNotNull(result.get())
        Assert.assertTrue(result.get()!!.isEmpty())
    }

    fun testEventEmptyAnalysis(jdbcUrl: String, type: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273669L

        val result =
            service.doAnalysis("sdk_key", "click_not_collect", "toggle_1", type, start, end)

        Assert.assertNotNull(result.get())
        Assert.assertTrue(result.get()!!.isEmpty())
    }

    fun testGaussianAnalysis(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273678L

        val result =
            service.doAnalysis("sdk_key2", "purchase", "toggle_2", "gaussian", start, end)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(4, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(45.0, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(44.72, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.1, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(4, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(125.0, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(44.72, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.9, result.get()!!["2"]?.winningPercentage!!, 0.1)
    }

}
