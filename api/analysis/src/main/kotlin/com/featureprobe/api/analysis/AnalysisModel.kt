package com.featureprobe.api.analysis

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import java.sql.Timestamp

const val RAW_VARIATION_TABLE: String = "__rawVariation"
const val UNIQ_VARIATION_TABLE: String = "__uniqVariation"
const val RAW_METRIC_TABLE: String = "__rawMetric"
const val METRIC_TABLE: String = "__metric"
const val CONVERT_USER_TABLE: String = "__convertUser"
const val CONVERT_COUNT_TABLE: String = "__convertCount"
const val VARIATION_COUNT_TABLE: String = "__variationCount"

const val INSERT_VARIATION_SQL =
    """INSERT INTO access (time, user_key, toggle_key, variation_index, rule_index, version, sdk_key) 
VALUES (?, ?, ?, ?, ?, ?, ?);"""

const val INSERT_EVENT_SQL =
    """INSERT INTO events (time, user_key, name, value, sdk_key)
VALUES (?, ?, ?, ?, ?);"""

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "kind",
)
@JsonSubTypes(
    JsonSubTypes.Type(AccessEvent::class, name = "access"),
    JsonSubTypes.Type(CustomEvent::class, name = "custom"),
    JsonSubTypes.Type(CustomEvent::class, name = "pageview"),
    JsonSubTypes.Type(CustomEvent::class, name = "click"),
)
@Suppress("unused")
sealed class Event(val kind: String)

data class AccessEvent(
    val time: Long,
    val user: String,
    val key: String,
    val variationIndex: Int,
    val ruleIndex: Int?,
    val version: Int?,
) : Event("access")


data class CustomEvent(
    val time: Long,
    val user: String,
    val name: String,
    val value: Double,
) : Event("custom")

data class EventRequest(
    val events: List<Event>,
)

data class EventResponse(
    val status: Int
)

data class AnalysisResponse(
    val status: Int,
    val data: Map<String, VariationProperty>?
)

sealed class AnalysisFailure

object NotSupportAnalysisType : AnalysisFailure()

data class VariationCount(val variation: String, val convert: Int, val all: Int)

data class CredibleInterval(
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val lower: Double,
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val upper: Double
)

data class DistributionDot(
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val x: Double,
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val y: Double
)

data class VariationProperty(
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val mean: Double,
    val credibleInterval: CredibleInterval,
    val distributionChart: List<DistributionDot>,
    @JsonSerialize(using = CustomDoubleSerialize::class)
    val winningPercentage: Double?,
)

data class ChartProperty(val min: Double, val max: Double, val step: Double)