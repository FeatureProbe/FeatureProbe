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
    fun testStoreEvents() {
        testStoreEvents(mysql.jdbcUrl)
        testStoreEvents(pg.jdbcUrl)
    }

    @Test
    fun testStoreNullCustomEvents() {
        testStoreNullCustomEvents(mysql.jdbcUrl)
        testStoreNullCustomEvents(pg.jdbcUrl)
    }

    @Test
    fun testEventExists() {
        testStoreEventExist(mysql.jdbcUrl)
        testStoreEventExist(pg.jdbcUrl)
    }

    fun testStoreEventExist(jdbcUrl: String) {
        storeEvents(jdbcUrl)
        val service = AnalysisService(jdbcUrl, "root", "root")

        assert(service.existsEvent("sdk_key", "testStoreClickExist"))
        assert(!service.existsEvent("sdk_key", "testStoreClickNotExist"))
    }

    fun testStoreEvents(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val access0 = AccessEvent(1676273668, "user0", "testStoreEventsToggle", 1, 1, 1)
        val access1 = AccessEvent(1676273668, "user1", "testStoreEventsToggle", 1, null, null)
        val event0 = CustomEvent(1676273668, "user0", "testStoreClick", 1.0)
        val event1 = CustomEvent(1676273668, "user1", "testStoreClick", 1.0)
        val req = EventRequest(arrayListOf(access0, access1, event0, event1))
        val session = sessionOf(service.dataSource)

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
    }

    fun storeEvents(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val event0 = CustomEvent(1676273668, "user0", "testStoreClickExist", 1.0)
        val req = EventRequest(arrayListOf(event0))
        service.storeEvents(req, "sdk_key")
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
    fun testBinomialAnalysis() {
        testBinomialAnalysis(mysql.jdbcUrl)
        testBinomialAnalysis(pg.jdbcUrl)
    }

    @Test
    fun testVariationEmptyBinomialAnalysis() {
        testVariationEmptyAnalysis(mysql.jdbcUrl, "binomial")
        testVariationEmptyAnalysis(pg.jdbcUrl, "binomial")
    }

    @Test
    fun testEventEmptyBinomialAnalysis() {
        testEventEmptyAnalysis(mysql.jdbcUrl, "binomial")
        testEventEmptyAnalysis(pg.jdbcUrl, "binomial")
    }

    @Test
    fun testGaussianAnalysis() {
        doTestGaussianAnalysis(mysql.jdbcUrl)
        doTestGaussianAnalysis(pg.jdbcUrl)
    }

    @Test
    fun testVariationEmptyGaussianAnalysis() {
        testVariationEmptyAnalysis(mysql.jdbcUrl, "gaussian")
        testVariationEmptyAnalysis(pg.jdbcUrl, "gaussian")
    }

    @Test
    fun testEventEmptyGaussianAnalysis() {
        testEventEmptyAnalysis(mysql.jdbcUrl, "gaussian")
        testEventEmptyAnalysis(pg.jdbcUrl, "gaussian")
    }

    @Test
    fun testDiagnose() {
        doTestDiagnose(mysql.jdbcUrl)
        doTestDiagnose(pg.jdbcUrl)
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

    fun doTestGaussianAnalysis(jdbcUrl: String) {
        testGaussianAnalysisAVG(jdbcUrl)
        testGaussianAnalysisCOUNT(jdbcUrl)
        testGaussianAnalysisSUM(jdbcUrl)
    }

    fun testGaussianAnalysisAVG(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273678L

        var result =
            service.doAnalysis("sdk_key2", "purchase", "toggle_2", "gaussian",
                start, end, true, NumeratorFn.AVG, Join.LEFT)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(5, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(37.0, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(51.58, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.1, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(4, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(126.25, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(48.15, result.get()!!["2"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.9, result.get()!!["2"]?.winningPercentage!!, 0.1)

        result =
            service.doAnalysis("sdk_key2", "purchase", "toggle_2", "gaussian",
                start, end, true, NumeratorFn.AVG, Join.INNER)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(4, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(46.25, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(48.15, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.11, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(4, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(126.25, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(48.15, result.get()!!["2"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.88, result.get()!!["2"]?.winningPercentage!!, 0.1)
    }

    fun testGaussianAnalysisCOUNT(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273678L

        var result =
            service.doAnalysis("sdk_key2", "purchase", "toggle_2", "gaussian",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(5, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(1.8, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(1.248, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.382, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(4, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(2.25, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(0.866, result.get()!!["2"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.618, result.get()!!["2"]?.winningPercentage!!, 0.1)

        result =
            service.doAnalysis("sdk_key2", "purchase", "toggle_2", "gaussian",
                start, end, true, NumeratorFn.COUNT, Join.INNER)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(4, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(2.25, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(0.866, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.506, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(4, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(2.25, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(0.866, result.get()!!["2"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.494, result.get()!!["2"]?.winningPercentage!!, 0.1)
    }

    fun testGaussianAnalysisSUM(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273678L

        var result =
            service.doAnalysis("sdk_key2", "purchase", "toggle_2", "gaussian",
                start, end, true, NumeratorFn.SUM, Join.LEFT)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(5, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(90.0, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(164.012, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.263, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(4, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(292.5, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(223.774, result.get()!!["2"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.764, result.get()!!["2"]?.winningPercentage!!, 0.1)

        result =
            service.doAnalysis("sdk_key2", "purchase", "toggle_2", "gaussian",
                start, end, true, NumeratorFn.SUM, Join.INNER)

        Assert.assertNotNull(result.get())
        Assert.assertEquals(4, result.get()!!["1"]?.sampleSize)
        Assert.assertEquals(112.5, result.get()!!["1"]?.mean!!, 0.1)
        Assert.assertEquals(157.718, result.get()!!["1"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.272, result.get()!!["1"]?.winningPercentage!!, 0.1)

        Assert.assertEquals(4, result.get()!!["2"]?.sampleSize)
        Assert.assertEquals(292.5, result.get()!!["2"]?.mean!!, 0.1)
        Assert.assertEquals(223.774, result.get()!!["2"]?.stdDeviation!!, 0.1)
        Assert.assertEquals(0.728, result.get()!!["2"]?.winningPercentage!!, 0.1)
    }

    fun doTestDiagnose(jdbcUrl: String) {
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = 1676273660L
        val end = 1676273678L

        var result =
            service.doDiagnose("sdk_key2", "purchase", "toggle_not_exist", "type_not_exist",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertEquals(Err(NotSupportAnalysisType), result)

        result =
            service.doDiagnose("sdk_key2", "purchase", "toggle_not_exist", "gaussian",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertEquals(Err(NoVariationRecords), result)

        result =
            service.doDiagnose("sdk_key2", "purchase", "toggle_not_exist", "binomial",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertEquals(Err(NoVariationRecords), result)

        result =
            service.doDiagnose("sdk_key2", "not_exist_metric", "toggle_3", "binomial",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertEquals(Err(NoEventRecords), result)

        result =
            service.doDiagnose("sdk_key2", "not_exist_metric", "toggle_3", "gaussian",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertEquals(Err(NoEventRecords), result)

        result =
            service.doDiagnose("sdk_key2", "can_not_join", "toggle_3", "binomial",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertEquals(Err(NoJoinRecords), result)

        result =
            service.doDiagnose("sdk_key2", "can_not_join", "toggle_3", "gaussian",
                start, end, true, NumeratorFn.COUNT, Join.LEFT)

        Assert.assertEquals(Err(NoJoinRecords), result)

    }

}
