package com.featureprobe.api.analysis

import org.apache.commons.math3.distribution.BetaDistribution
import java.sql.PreparedStatement
import java.sql.Timestamp

fun chanceToWin(distributions: Map<String, BetaDistribution>, iteration: Int): Map<String, Double> {
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


fun statsSql(metric: String, toggle: String, start: Timestamp, end: Timestamp): String {
    return """
WITH $RAW_VARIATION_TABLE as (${userProvideVariationSql()}),
    $UNIQ_VARIATION_TABLE as (${uniqVariationSql(toggle, start, end)}),
    $METRIC_TABLE as (${userProvideMetricSql(metric)}),
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
FROM access_events"""
}

fun uniqVariationSql(toggle: String, start: Timestamp, end: Timestamp): String {
    return """
SELECT 
    v.user_key, v.variation, v.time 
FROM $RAW_VARIATION_TABLE v 
WHERE 
    v.toggle_key = '$toggle' and v.time > '$start' and v.time < '$end'"""
}

fun userProvideMetricSql(metric: String): String {
    return "SELECT user_key, time FROM custom_events WHERE name = '$metric'"
}

fun convertUserSql(): String {
    return "SELECT m.user_key, variation FROM $UNIQ_VARIATION_TABLE u JOIN $METRIC_TABLE m ON (u.user_key = m.user_key)"
}

fun convertCountSql(): String {
    return "SELECT COUNT(*) as cvt ,variation FROM $CONVERT_USER_TABLE GROUP BY variation"
}

fun variationCountSql(): String {
    return "SELECT COUNT(*) as total, variation FROM $UNIQ_VARIATION_TABLE GROUP BY variation"
}

fun batchAddAccessEvent(
    ps: PreparedStatement,
    it: AccessEvent,
    sdkKey: String
) {
    ps.setTimestamp(1, it.time)
    ps.setString(2, it.user)
    ps.setString(3, it.toggle)
    ps.setInt(4, it.variationIndex)
    ps.setObject(5, it.ruleIndex)
    ps.setObject(6, it.version)
    ps.setString(7, sdkKey)

    ps.addBatch()
}

fun batchAddCustomEvent(
    ps: PreparedStatement,
    it: CustomEvent,
    sdkKey: String
) {
    ps.setTimestamp(1, it.time)
    ps.setString(2, it.user)
    ps.setString(3, it.name)
    ps.setDouble(4, it.value)
    ps.setString(5, sdkKey)

    ps.addBatch()
}