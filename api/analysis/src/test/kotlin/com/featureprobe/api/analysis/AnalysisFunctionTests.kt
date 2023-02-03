package com.featureprobe.api.analysis

import org.apache.commons.math3.distribution.BetaDistribution
import org.junit.Assert.assertEquals
import org.junit.Test

class AnalysisFunctionTestClass {

    @Test
    fun testChanceToWin() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(120.0, 300.0)
        val ctw = chanceToWin(mapOf("v1" to d1, "v2" to d2), 1000)

        assertEquals(ctw["v1"]!!, 0.93, 0.1)
        assertEquals(ctw["v2"]!!, 0.07, 0.1)
    }

    @Test
    fun testChanceToWin2() {
        val d1 = BetaDistribution(150.0, 300.0)
        val d2 = BetaDistribution(50.0, 300.0)
        val ctw = chanceToWin(mapOf("v1" to d1, "v2" to d2), 1000)

        assertEquals(ctw["v1"]!!, 0.999, 0.1)
        assertEquals(ctw["v2"]!!, 0.001, 0.1)
    }

}