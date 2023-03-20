package com.featureprobe.api.analysis

import org.apache.commons.math3.distribution.BetaDistribution
import org.apache.commons.math3.distribution.NormalDistribution
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class AnalysisFunctionKtTests{

    @Test
    fun testWinningProbability() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(120.0, 300.0)
        val wp = calculateWinningProbability(
            mapOf("v1" to d1, "v2" to d2),
            1000
        )

        assertEquals(wp["v1"]!!, 0.93, 0.1)
        assertEquals(wp["v2"]!!, 0.07, 0.1)
    }

    @Test
    fun testWinningProbability2() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(50.0, 300.0)
        val wp = calculateWinningProbability(
            mapOf("v1" to d1, "v2" to d2),
            1000
        )

        assertEquals(wp["v1"]!!, 0.999, 0.1)
        assertEquals(wp["v2"]!!, 0.001, 0.1)
    }

    @Test
    fun testWinningProbability3variations() {
        val d1 = BetaDistribution(75.0, 300.0)
        val d2 = BetaDistribution(50.0, 300.0)
        val d3 = BetaDistribution(25.0, 300.0)
        val wp = calculateWinningProbability(
            mapOf("v1" to d1, "v2" to d2, "v3" to d3),
            1000
        )

        assertTrue(wp["v1"]!! > wp["v2"]!!)
        assertTrue(wp["v2"]!! > wp["v3"]!!)
    }

    @Test
    fun testBinomialVariationAnalysis() {
        val variationCount = arrayListOf(VariationConvert("1", 200, 300), VariationConvert("2", 300, 400))
        val distributions = variationCount.associate {
            it.variation to BetaDistributionInfo(
                BetaDistribution(1.0 + it.convert, 1.0 + it.sampleSize - it.convert),
                it.convert,
                it.sampleSize
            )
        }

        val variations = binomialVariationStats(distributions, 100, true)

        assertEquals(0.666, variations["1"]!!.mean, 0.001)
        assertEquals(0.620, variations["1"]!!.credibleInterval.lower, 0.001)
        assertEquals(0.709, variations["1"]!!.credibleInterval.upper, 0.001)
        assertEquals(0.01, variations["1"]!!.winningPercentage!!, 0.01)

        assertEquals(0.748, variations["2"]!!.mean, 0.001)
        assertEquals(0.712, variations["2"]!!.credibleInterval.lower, 0.001)
        assertEquals(0.783, variations["2"]!!.credibleInterval.upper, 0.001)
        assertEquals(0.99, variations["2"]!!.winningPercentage!!, 0.1)

    }

    @Test
    fun testGaussianVariationAnalysis() {
        val variationCount = arrayListOf(
            VariationGaussian("1", 45.0, 44.72, 4),
            VariationGaussian("2", 125.0, 44.72, 4)
        )
        val distributions = variationCount.associate {

            it.variation to GaussianDistributionInfo(
                NormalDistribution(it.mean, it.stdDeviation),
                it.mean,
                it.stdDeviation,
                it.sampleSize
            )
        }

        val variations = gaussianVariationStats(distributions, 1000, true)

        assertEquals(-28.557, variations["1"]!!.credibleInterval.lower, 0.01)
        assertEquals(118.557, variations["1"]!!.credibleInterval.upper, 0.01)
        assertEquals(0.11, variations["1"]!!.winningPercentage!!, 0.1)

        assertEquals(51.44, variations["2"]!!.credibleInterval.lower, 0.01)
        assertEquals(198.55, variations["2"]!!.credibleInterval.upper, 0.01)
        assertEquals(0.89, variations["2"]!!.winningPercentage!!, 0.1)
    }

    @Test
    fun testChartProperty() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(120.0, 300.0)
        val property = chartProperty(mapOf("1" to d1, "2" to d2), true)

        assertEquals(0.213, property!!.min, 0.001)
        assertEquals(0.406, property!!.max, 0.001)
        assertEquals(0.007, property!!.step, 0.001)

        val d3 = NormalDistribution(45.0, 44.72)
        val d4 = NormalDistribution(125.0, 44.72)
        val property2 = chartProperty(mapOf("1" to d3, "2" to d4), false)

        assertEquals(-102.1, property2!!.min, 0.1)
        assertEquals(272.1, property2!!.max, 0.1)
        assertEquals(14.7, property2!!.step, 0.1)
    }

}