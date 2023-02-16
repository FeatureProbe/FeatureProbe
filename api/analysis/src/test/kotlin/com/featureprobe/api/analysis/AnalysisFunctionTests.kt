package com.featureprobe.api.analysis

import org.apache.commons.math3.distribution.BetaDistribution
import org.junit.Assert.assertEquals
import org.junit.Test

class AnalysisFunctionTestClass {

    @Test
    fun testWinningPercentage() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(120.0, 300.0)
        val wp = winningPercentage(
            mapOf("v1" to DistributionInfo(d1, 150, 300), "v2" to DistributionInfo(d2, 120, 300)),
            1000
        )

        assertEquals(wp["v1"]!!, 0.93, 0.1)
        assertEquals(wp["v2"]!!, 0.07, 0.1)
    }

    @Test
    fun testWinningPercentage2() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(50.0, 300.0)
        val wp = winningPercentage(
            mapOf("v1" to DistributionInfo(d1, 150, 300), "v2" to DistributionInfo(d2, 50, 300)),
            1000
        )

        assertEquals(wp["v1"]!!, 0.999, 0.1)
        assertEquals(wp["v2"]!!, 0.001, 0.1)
    }

    @Test
    fun testVariationAnalysis() {
        val variationCount = arrayListOf(VariationCount("1", 200, 300), VariationCount("2", 300, 400))
        val distributions = variationCount.associate {
            it.variation to DistributionInfo(
                BetaDistribution(1.0 + it.convert, 1.0 + it.all - it.convert),
                it.convert,
                it.all
            )
        }

        val variations = variationStats(distributions, 100)

        assertEquals(0.666, variations["1"]!!.mean, 0.001)
        assertEquals(0.620, variations["1"]!!.credibleInterval.lower, 0.001)
        assertEquals(0.709, variations["1"]!!.credibleInterval.upper, 0.001)
        assertEquals(0.01, variations["1"]!!.winningPercentage!!, 0.01)

        assertEquals(0.748, variations["2"]!!.mean, 0.001)
        assertEquals(0.712, variations["2"]!!.credibleInterval.lower, 0.001)
        assertEquals(0.783, variations["2"]!!.credibleInterval.upper, 0.001)
        assertEquals(0.99, variations["2"]!!.winningPercentage!!, 0.1)

    }

}