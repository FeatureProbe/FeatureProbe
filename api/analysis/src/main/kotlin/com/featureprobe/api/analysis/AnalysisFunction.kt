package com.featureprobe.api.analysis

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import org.apache.commons.math3.distribution.BetaDistribution
import java.io.IOException
import java.math.BigDecimal
import java.math.RoundingMode
import java.sql.PreparedStatement
import java.text.DecimalFormat

fun winningPercentage(distributions: Map<String, BetaDistribution>, iteration: Int): Map<String, Double> {
    if (distributions.isEmpty()) {
        return mapOf()
    }

    val variationWins = distributions.keys.associateWith { 0.0 }.toMutableMap()

    for (i in 0 until iteration) {
        var maxSample: Double? = null
        var maxVariation: String? = null
        for (entry in distributions) {

            val sample = entry.value.sample()
            if (maxSample == null || maxSample < sample) {
                maxSample = sample
                maxVariation = entry.key
            }
        }

        val w = variationWins[maxVariation] ?: 0.0
        variationWins[maxVariation!!] = w + 1.0
    }

    return variationWins.map { it.key to it.value / iteration }.toMap()
}

fun variationStats(
    distributions: Map<String, BetaDistribution>,
    winningPercentage: Map<String, Double>
): Map<String, VariationProperty> {
    return distributions.map {
        val distributionChart = (0..9).map { i ->
            val x = 0.05 + i * 0.1
            val y = it.value.inverseCumulativeProbability(x)
            DistributionDot(x, y)
        }.toList()

        it.key to VariationProperty(
            it.value.numericalMean,
            CredibleInterval(
                it.value.inverseCumulativeProbability(0.05),
                it.value.inverseCumulativeProbability(0.95),
            ),
            distributionChart,
            winningPercentage[it.key]
        )
    }.toMap()
}


fun statsSql(metric: String, toggle: String, start: Long, end: Long): String {
    return """
WITH $RAW_VARIATION_TABLE as (${userProvideVariationSql()}),
    $UNIQ_VARIATION_TABLE as (${uniqVariationSql(toggle, start, end)}),
    $RAW_METRIC_TABLE as (${userProvideMetricSql(metric)}),
    $METRIC_TABLE as (${metricSql(start, end)}),
    $CONVERT_USER_TABLE as (${convertUserSql()}),
    $CONVERT_COUNT_TABLE as (${convertCountSql()}),
    $VARIATION_COUNT_TABLE as (${variationCountSql()})
SELECT v.variation, c.cvt, v.total FROM $CONVERT_COUNT_TABLE c, $VARIATION_COUNT_TABLE v
WHERE c.variation = v.variation;"""
}

fun userProvideVariationSql(): String {
    return """
SELECT 
    user_key, time, toggle_key, variation_index as variation 
FROM access"""
}

fun uniqVariationSql(toggle: String, start: Long, end: Long): String {
    return """
SELECT 
    v.user_key, v.variation, v.time 
FROM $RAW_VARIATION_TABLE v 
WHERE 
    v.toggle_key = '$toggle' and v.time > '$start' and v.time < '$end'"""
}

fun metricSql(start: Long, end: Long): String {
    return """
SELECT 
    *
FROM $RAW_METRIC_TABLE v 
WHERE 
    v.time > '$start' and v.time < '$end'"""
}

fun userProvideMetricSql(metric: String): String {
    return "SELECT user_key, time FROM events WHERE name = '$metric'"
}

fun convertUserSql(): String {
    return "SELECT m.user_key, variation FROM $UNIQ_VARIATION_TABLE u JOIN $RAW_METRIC_TABLE m ON (u.user_key = m.user_key)"
}

fun convertCountSql(): String {
    return "SELECT COUNT(*) as cvt ,variation FROM $CONVERT_USER_TABLE GROUP BY variation"
}

fun variationCountSql(): String {
    return "SELECT COUNT(*) as total, variation FROM $UNIQ_VARIATION_TABLE GROUP BY variation"
}

fun batchAddVariation(
    ps: PreparedStatement,
    it: AccessEvent,
    sdkKey: String
) {
    ps.setLong(1, it.time)
    ps.setString(2, it.user)
    ps.setString(3, it.key)
    ps.setInt(4, it.variationIndex)
    ps.setObject(5, it.ruleIndex)
    ps.setObject(6, it.version)
    ps.setString(7, sdkKey)

    ps.addBatch()
}

fun batchAddEvent(
    ps: PreparedStatement,
    it: CustomEvent,
    sdkKey: String
) {
    ps.setLong(1, it.time)
    ps.setString(2, it.user)
    ps.setString(3, it.name)
    ps.setDouble(4, it.value)
    ps.setString(5, sdkKey)

    ps.addBatch()
}

class CustomDoubleSerialize : JsonSerializer<Double>() {
    private val df = DecimalFormat("0.000")

    @Throws(IOException::class)
    override fun serialize(arg0: Double, arg1: JsonGenerator, arg2: SerializerProvider?) {
        val bigDecimal = BigDecimal(arg0.toString())
        df.roundingMode = RoundingMode.HALF_UP
        val format = df.format(bigDecimal)
        val aDouble = format.toDouble()
        arg1.writeNumber(aDouble)
    }
}