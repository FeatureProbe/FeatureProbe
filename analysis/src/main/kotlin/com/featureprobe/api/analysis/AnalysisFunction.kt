package com.featureprobe.api.analysis

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.JsonSerializer
import com.fasterxml.jackson.databind.SerializerProvider
import org.apache.commons.math3.distribution.AbstractRealDistribution
import java.io.IOException
import java.math.BigDecimal
import java.math.RoundingMode
import java.sql.PreparedStatement
import java.text.DecimalFormat
import kotlin.math.sqrt

// rename type String to VariationName
typealias VariationName = String

/**
 * Calculate the winning probability of each variation.
 *
 * @param variations a map of variation name to distribution
 * @param sampleSize the number of samples to take
 * @param positiveWin whether the higher value is the winning value
 * @return a map of variation name to winning probability
 */
fun calculateWinningProbability(
    variations: Map<VariationName, AbstractRealDistribution>,
    sampleSize: Int,
    positiveWin: Boolean = true
): Map<VariationName, Double> {

    // must have at least 2 variations
    if (variations.size < 2) return mapOf()

    val variationScore = variations.keys.associateWith { 0 }.toMutableMap()

    for (i in 0 until sampleSize) {

        val thisRound = variations.map { it.key to it.value.sample() }

        val winner = if (positiveWin) {
            thisRound.maxByOrNull { it.second }
        } else {
            thisRound.minByOrNull { it.second }
        }

        variationScore[winner!!.first] = variationScore[winner.first]!! + 1

    }

    return variationScore.map { it.key to it.value / sampleSize.toDouble() }.toMap()
}

fun binomialVariationStats(
    distributionInfos: Map<VariationName, BetaDistributionInfo>,
    iterationCount: Int,
    positiveWin: Boolean
): Map<VariationName, VariationProperty> {
    val distributions = distributionInfos.map { it.key to it.value.distribution }.toMap()
    val chartProperty = chartProperty(distributions, true)
    val winningProbability = calculateWinningProbability(distributions, iterationCount, positiveWin)

    return distributionInfos.map {
        it.key to VariationProperty(
            it.value.sampleSize,
            it.value.distribution.numericalMean,
            0.0,
            CredibleInterval(
                it.value.distribution.inverseCumulativeProbability(0.05),
                it.value.distribution.inverseCumulativeProbability(0.95),
            ),
            distributionChart(chartProperty!!, it.value.distribution, true),
            winningProbability[it.key]
        )
    }.toMap()
}

fun posteriorGaussian(v0: GaussianParam, va: GaussianParam): GaussianParam {
    val invVar0 = v0.sampleSize / (v0.stdDeviation * v0.stdDeviation)
    val invVarD = va.sampleSize / (va.stdDeviation * va.stdDeviation)
    val v = 1 / (invVar0 + invVarD)

    val mu = v * (invVar0 * v0.mean + invVarD * va.mean)
    val stdDeviation = 1 / sqrt (invVar0 + invVarD)

    return GaussianParam(mu, stdDeviation, va.sampleSize)
}

fun gaussianVariationStats(
    distributionInfos: Map<String, GaussianDistributionInfo>,
    iterationCount: Int,
    positiveWin: Boolean
): Map<String, VariationProperty> {
    val distributions = distributionInfos.map { it.key to it.value.distribution }.toMap()
    val chartProperty = chartProperty(distributions, false)
    val winningProbability = calculateWinningProbability(distributions, iterationCount, positiveWin)

    return distributionInfos.map {
        it.key to VariationProperty(
            it.value.sampleSize,
            it.value.distribution.numericalMean,
            it.value.distribution.standardDeviation,
            CredibleInterval(
                it.value.distribution.inverseCumulativeProbability(0.05),
                it.value.distribution.inverseCumulativeProbability(0.95),
            ),
            distributionChart(chartProperty!!, it.value.distribution, false),
            winningProbability[it.key]
        )
    }.toMap()
}

fun chartProperty(ds: Map<String, AbstractRealDistribution>, binomial: Boolean): ChartProperty? {
    var minX: Double? = null
    var maxX: Double? = null
    var step: Double? = null
    ds.map {
        val xP05 = it.value.inverseCumulativeProbability(0.05)
        val xP95 = it.value.inverseCumulativeProbability(0.95)

        //       <-- range --> <----range --> <---range----->
        //       |------|------|--------------|------|-------|
        // p05 - range       p05            p95           p95 + range

        val range = xP95 - xP05
        var min = xP05 - range / 2
        var max = xP95 + range / 2

        if (binomial && min < 0.0) {
            min = 0.0
        }
        if (binomial && max > 1.0) {
            max = 1.0
        }

        if (minX == null || min < minX!!) {
            minX = min
        }

        if (maxX == null || maxX!! < max) {
            maxX = max
        }

        val s = range / 10
        if (step == null || step!! > s) {
            step = s
        }
    }

    if (ds.isEmpty()) {
        return null
    }
    return ChartProperty(minX!!, maxX!!, step!!)
}


fun distributionChart(p: ChartProperty, d: AbstractRealDistribution, binomial: Boolean): List<DistributionDot> {
    val dots = mutableListOf<DistributionDot>()
    val extendMoreDots = 3
    var dotIndex = 0
    while (true) {
        val x = p.min + (dotIndex - extendMoreDots) * p.step
        dotIndex++

        if (binomial && x < 0) {
            continue
        }
        if (x > p.max + extendMoreDots * p.step || (binomial && x > 1)) {
            break
        }

        val y = d.density(x)
        dots.add(DistributionDot(x, y))
    }
    return dots
}

fun binomialStatsSql(sdkKey: String, metric: String, toggle: String, start: Long, end: Long) =
    """
WITH $RAW_VARIATION_TABLE AS (${userProvideVariationSql(sdkKey)}),
    $UNIQ_VARIATION_TABLE AS (${uniqVariationSql(toggle, start, end)}),
    $RAW_METRIC_TABLE AS (${userProvideMetricSql(sdkKey, metric)}),
    $METRIC_TABLE AS (${uniqMetricSql(start, end)}),
    $CONVERT_USER_TABLE AS (${convertUserSql()}),
    $CONVERT_COUNT_TABLE AS (${convertCountSql()}),
    $VARIATION_COUNT_TABLE AS (${variationCountSql()})
SELECT v.variation, c.cvt, v.total FROM $CONVERT_COUNT_TABLE c, $VARIATION_COUNT_TABLE v
WHERE c.variation = v.variation;"""

fun gaussianStatsSql(sdkKey: String, metric: String, toggle: String,
                     start: Long, end: Long, fn: NumeratorFn, join: Join) =
    """
WITH $RAW_VARIATION_TABLE AS (${userProvideVariationSql(sdkKey)}),
    $UNIQ_VARIATION_TABLE AS (${uniqVariationSql(toggle, start, end)}),
    $RAW_METRIC_TABLE AS (${userProvideMetricSql(sdkKey, metric)}),
    $METRIC_USER_VALUE_TABLE AS (${numeratorMetricSql(start, end, fn)}),
    $USER_VALUE_VARIATION_TABLE AS (${userValueVariationSql(join)}),
    $VARIATION_MEAN_TABLE AS (${variationMeanSql()}),
    $METRIC_USER_TOTAL_MEAN_TABLE AS (${metricUserTotalMeanSql()}),
    $VARIATION_VARIANCE_TABLE AS (${variationVarianceSql()}),
    $VARIATION_STD_DEVIATION_TABLE AS (${variationStdDeviationSql()})
SELECT s.variation, s.std_deviation, t.mean, t.count FROM $VARIATION_STD_DEVIATION_TABLE s, $VARIATION_MEAN_TABLE t
WHERE s.variation = t.variation AND t.count > 1;"""

fun userProvideVariationSql(sdkKey: String) =
    """
SELECT 
    user_key, time, toggle_key, variation_index AS variation 
FROM access
WHERE sdk_key = '$sdkKey'"""


fun uniqVariationSql(toggle: String, start: Long, end: Long) =
    """
SELECT 
    v.user_key, v.variation
FROM $RAW_VARIATION_TABLE v 
WHERE 
    v.toggle_key = '$toggle' and v.time > '$start' and v.time < '$end'
GROUP BY v.user_key, v.variation"""

fun uniqMetricSql(start: Long, end: Long) =
    """
SELECT 
    user_key
FROM $RAW_METRIC_TABLE v 
WHERE 
    v.time > '$start' and v.time < '$end'
GROUP BY user_key"""

fun numeratorMetricSql( start: Long, end: Long, fn: NumeratorFn): String {
    val value = when (fn) {
        NumeratorFn.AVG -> "AVG(COALESCE(value, 0))"
        NumeratorFn.COUNT -> "COUNT(*)"
        NumeratorFn.SUM -> "SUM(value)"
    }

    return """
SELECT 
    user_key, $value AS value
FROM $RAW_METRIC_TABLE v 
WHERE 
    v.time > '$start' and v.time < '$end'
GROUP BY user_key"""
}

fun userProvideMetricSql(sdkKey: String, metric: String) =
    "SELECT user_key, time, value FROM events WHERE name = '$metric' AND sdk_key = '$sdkKey'"

fun convertUserSql() =
    "SELECT m.user_key, variation FROM $UNIQ_VARIATION_TABLE u JOIN $METRIC_TABLE m ON (u.user_key = m.user_key) GROUP BY m.user_key, variation"

fun convertCountSql() =
    "SELECT COUNT(*) AS cvt ,variation FROM $CONVERT_USER_TABLE GROUP BY variation"

fun variationCountSql() =
    "SELECT COUNT(*) AS total, variation FROM $UNIQ_VARIATION_TABLE GROUP BY variation"

fun variationMeanSql() =
    "SELECT AVG(COALESCE(value, 0)) AS mean, variation, COUNT(*) AS count FROM $USER_VALUE_VARIATION_TABLE GROUP BY variation"

fun userValueVariationSql(join: Join) : String {
    val joinType = when (join) {
        Join.INNER -> "INNER JOIN"
        Join.LEFT -> "LEFT JOIN"
    }
    return "SELECT m.value, v.variation, m.user_key FROM $UNIQ_VARIATION_TABLE v $joinType $METRIC_USER_VALUE_TABLE m ON m.user_key = v.user_key"
}

fun metricUserTotalMeanSql() =
    "SELECT j.user_key, j.value AS user_value, t.mean AS total_mean, j.variation FROM $USER_VALUE_VARIATION_TABLE j, $VARIATION_MEAN_TABLE t where j.variation = t.variation"

fun variationVarianceSql() =
    "SELECT POWER(user_value - total_mean, 2) AS variance, variation FROM $METRIC_USER_TOTAL_MEAN_TABLE"

fun variationStdDeviationSql() =
    "SELECT SQRT(SUM(variance)) AS std_deviation, variation FROM $VARIATION_VARIANCE_TABLE group by variation"


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
    if (it.value != null) {
        ps.setDouble(4, it.value)
    } else {
        ps.setNull(4, java.sql.Types.DOUBLE)
    }
    ps.setString(5, sdkKey)

    ps.addBatch()
}

class CustomDoubleSerialize : JsonSerializer<Double>() {
    private val df = DecimalFormat("0.00000")

    @Throws(IOException::class)
    override fun serialize(arg0: Double, arg1: JsonGenerator, arg2: SerializerProvider?) {
        val bigDecimal = BigDecimal(arg0.toString())
        df.roundingMode = RoundingMode.HALF_UP
        val format = df.format(bigDecimal)
        val aDouble = format.toDouble()
        arg1.writeNumber(aDouble)
    }
}