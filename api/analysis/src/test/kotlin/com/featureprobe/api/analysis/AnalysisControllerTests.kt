package com.featureprobe.api.analysis

import com.github.michaelbull.result.*
import kotliquery.queryOf
import kotliquery.sessionOf
import org.junit.Assert
import org.junit.ClassRule
import org.junit.Test
import org.springframework.boot.test.context.SpringBootTest
import org.testcontainers.containers.MySQLContainer
import org.testcontainers.utility.DockerImageName
import java.sql.Timestamp

// for mac with M1/M2 chips:  docker pull arm64v8/mysql:8.0
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
    }

    @Test
    fun testStoreEvents() {
        val jdbcUrl = mysql.jdbcUrl
        val service = AnalysisService(jdbcUrl, "root", "root")
        val access0 = AccessEvent(Timestamp(1675326294000), "user0", "testStoreEventsToggle", 1, 1, 1)
        val access1 = AccessEvent(Timestamp(1675326294000), "user1", "testStoreEventsToggle", 1, null, null)
        val event0 = CustomEvent(Timestamp(1675326294000), "user0", "testStoreClick", 1.0)
        val event1 = CustomEvent(Timestamp(1675326294000), "user1", "testStoreClick", 1.0)
        val req = EventRequest(arrayListOf(access0, access1, event0, event1))
        val session = sessionOf(service.dataSource)

        session.run(queryOf("BEGIN").asExecute)

        service.storeEvents(req, "sdk_key")
        val accessEventCount: List<Int> = session.run(
            queryOf("SELECT count(*) as c FROM access_events WHERE toggle_key = 'testStoreEventsToggle'")
                .map { row -> row.int("c") }.asList
        )
        val customEventCount: List<Int> = session.run(
            queryOf("SELECT count(*) as c FROM custom_events WHERE name = 'testStoreClick'")
                .map { row -> row.int("c") }.asList
        )

        assert(accessEventCount == arrayListOf(2))
        assert(customEventCount == arrayListOf(2))

        session.run(queryOf("ROLLBACK").asExecute)
    }

    @Test
    fun convertAnalysis() {
        val jdbcUrl = mysql.jdbcUrl
        val service = AnalysisService(jdbcUrl, "root", "root")
        val start = Timestamp.valueOf("2023-02-02 23:25:44.659")
        val end = Timestamp.valueOf("2023-02-02 23:45:44.659")

        val result: Result<AnalysisReport, AnalysisFailure> = service.doAnalysis("sdkKey", "click_1", "toggle_1", "binomial", "1", start, end)

        Assert.assertNotNull(result.get())

        val changeToWin = result.get()!!.ctw
        Assert.assertEquals(changeToWin["1"]!!, 0.6, 0.1)
        Assert.assertEquals(changeToWin["2"]!!, 0.4, 0.1)
    }
}
