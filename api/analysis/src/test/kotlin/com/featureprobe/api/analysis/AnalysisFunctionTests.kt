package com.featureprobe.api.analysis

import org.apache.commons.math3.distribution.BetaDistribution
import org.junit.Assert.assertEquals
import org.junit.Test

class AnalysisFunctionTestClass {

    @Test
    fun testWinningPercentage() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(120.0, 300.0)
        val wp = winningPercentage(mapOf("v1" to d1, "v2" to d2), 1000)

        assertEquals(wp["v1"]!!, 0.93, 0.1)
        assertEquals(wp["v2"]!!, 0.07, 0.1)
    }

    @Test
    fun testWinningPercentage2() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(50.0, 300.0)
        val wp = winningPercentage(mapOf("v1" to d1, "v2" to d2), 1000)

        assertEquals(wp["v1"]!!, 0.999, 0.1)
        assertEquals(wp["v2"]!!, 0.001, 0.1)
    }

    @Test
    fun testVariationAnalysis() {
        val variationCount = arrayListOf(VariationCount("1", 200000, 300000), VariationCount("2", 300, 400))
        val distributions = variationCount.associate {
            it.variation to BetaDistribution(1.0 + it.convert, 1.0 + it.all - it.convert)
        }

        val variations = variationStats(distributions, mapOf("1" to 70.0, "2" to 30.0))

        assertEquals(variations["1"]!!.mean, 0.666, 0.001)
        assertEquals(variations["1"]!!.credibleInterval.lower, 0.665, 0.001)
        assertEquals(variations["1"]!!.credibleInterval.upper, 0.668, 0.001)
        assertEquals(variations["1"]!!.winningPercentage!!, 70.0, 0.1)
        testVariationChart(variations["1"]!!)

        assertEquals(variations["2"]!!.mean, 0.748, 0.001)
        assertEquals(variations["2"]!!.credibleInterval.lower, 0.712, 0.001)
        assertEquals(variations["2"]!!.credibleInterval.upper, 0.783, 0.001)
        assertEquals(variations["2"]!!.distributionChart.count(), 10)
        assertEquals(variations["2"]!!.winningPercentage!!, 30.0, 0.1)
        testVariationChart(variations["2"]!!)

    }

    private fun testVariationChart(v: VariationProperty) {
        assertEquals(v.distributionChart.count(), 10)

        for (i in 0..4) {
            v.distributionChart[i].y < v.distributionChart[i + 1].y
        }

        for (i in 5..8) {
            v.distributionChart[i].y > v.distributionChart[i + 1].y
        }

        assertEquals(v.distributionChart[4].x + v.distributionChart[5].x, v.mean * 2, 0.01)
    }

}