package com.featureprobe.api.analysis

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import org.apache.commons.math3.distribution.BetaDistribution
import org.apache.commons.math3.distribution.NormalDistribution

const val RAW_VARIATION_TABLE: String = "__rawVariation"
const val UNIQ_VARIATION_TABLE: String = "__uniqVariation"
const val RAW_METRIC_TABLE: String = "__rawMetric"
const val METRIC_TABLE: String = "__metric"
const val CONVERT_USER_TABLE: String = "__convertUser"
const val CONVERT_COUNT_TABLE: String = "__convertCount"
const val VARIATION_COUNT_TABLE: String = "__variationCount"
const val METRIC_USER_VALUE_TABLE: String = "__metricUserValue"
const val VARIATION_MEAN_TABLE: String = "__variationMean"
const val USER_VALUE_VARIATION_TABLE: String = "__userValueVariation"
const val METRIC_USER_TOTAL_MEAN_TABLE: String = "__userTotalMean"
const val VARIATION_VARIANCE_TABLE: String = "__variationVariance"
const val VARIATION_STD_DEVIATION_TABLE: String = "__variationStdDeviation"

const val INSERT_VARIATION_SQL =
    """INSERT INTO access (time, user_key, toggle_key, variation_index, rule_index, version, sdk_key, 
        sdk_type, sdk_version, value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"""

const val INSERT_EVENT_SQL =
    """INSERT INTO events (time, user_key, name, value, sdk_key, sdk_type, sdk_version, kind)
VALUES (?, ?, ?, ?, ?, ?, ?, ?);"""

const val EXISTS_EVENT_SQL =
    """SELECT 1 as count FROM events WHERE sdk_key = ? AND name = ? AND sdk_type = ? LIMIT 1;"""

const val SELECT_ACCESS_SQL =
    """SELECT * FROM access WHERE sdk_key = ? AND time >= ?;"""

const val SELECT_EVENT_SQL =
    """SELECT * FROM events WHERE sdk_key = ? AND time >= ?;"""

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "kind",
    visible = true
)
@JsonSubTypes(
    JsonSubTypes.Type(AccessEvent::class, name = "access"),
    JsonSubTypes.Type(AnalysisEvent::class, name = "custom"),
    JsonSubTypes.Type(AnalysisEvent::class, name = "pageview"),
    JsonSubTypes.Type(AnalysisEvent::class, name = "click"),
    JsonSubTypes.Type(DebugEvent::class, name = "debug")
)
@JsonIgnoreProperties(ignoreUnknown = true)
@Suppress("unused")
sealed class Event(open val kind: String)

data class AccessEvent(
    val time: Long,
    val user: String,
    val value: String,
    val key: String,
    val variationIndex: Int,
    val ruleIndex: Int?,
    val version: Int?,
    val sdkType: String?,
    val sdkVersion: String?,
) : Event("access") {
    constructor(time: Long, user: String, key: String, variationIndex: Int, ruleIndex: Int?, version: Int?) :
            this(time, user, "", key, variationIndex, ruleIndex, version, "", "")
}

data class AnalysisEvent(
    override val kind: String,
    val time: Long,
    val user: String,
    val name: String,
    val value: Double?,
    val sdkType: String?,
    val sdkVersion: String?,
): Event(kind) {
    constructor(time: Long, user: String, name: String, value: Double?) :
            this("custom", time, user, name, value, "", "")
}

data class DebugEvent(
    val time: Long,
    val user: Any,
    val key: String,
    val variationIndex: Int,
    val ruleIndex: Int?,
    val version: Int?,
) : Event("debug")

data class EventRequest(
    val events: List<Event>,
)

data class EventResponse(
    val status: Int
)

data class EventExistsResponse(
        val status: Int,
        val exists: Boolean
)

data class AnalysisResponse(
    val status: Int,
    val data: Map<String, VariationProperty>?,
    val errMsg: String?,
)

sealed class AnalysisFailure

object NotSupportAnalysisType : AnalysisFailure()

object NoVariationRecords : AnalysisFailure()

object NoEventRecords : AnalysisFailure()

object NoJoinRecords: AnalysisFailure()

object NoVariationAndEventRecords: AnalysisFailure()

object AnalysisSuccess

data class VariationConvert(val variation: String, val convert: Int, val sampleSize: Int)

data class VariationGaussian(val variation: String, val mean: Double, val stdDeviation: Double, val sampleSize: Int)

data class CredibleInterval(
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val lower: Double,
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val upper: Double
)

data class DistributionDot(
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val x: Double,
    val y: Double
)

data class BetaDistributionInfo(val distribution: BetaDistribution, val convert: Int, val sampleSize: Int)

data class GaussianDistributionInfo(val distribution: NormalDistribution, val mean: Double, val stdDeviation: Double, val sampleSize: Int)

data class VariationProperty(
    val sampleSize: Int,
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val mean: Double,
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val stdDeviation: Double,
    val credibleInterval: CredibleInterval,
    val distributionChart: List<DistributionDot>,
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val winningPercentage: Double?
)

data class ChartProperty(val min: Double, val max: Double, val step: Double)

// Default is no information Prior value
data class GaussianParam(val mean: Double = 0.0, val stdDeviation: Double = 1.0, val sampleSize: Int = 0)

enum class AggregateFn {
    AVG,
    SUM,
    COUNT
}

enum class Join {
    LEFT,
    INNER
}
