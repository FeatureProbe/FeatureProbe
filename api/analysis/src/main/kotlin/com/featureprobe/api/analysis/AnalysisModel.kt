package com.featureprobe.api.analysis

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.sql.Timestamp

const val RAW_VARIATION_TABLE: String = "__rawVariation"
const val UNIQ_VARIATION_TABLE: String = "__uniqVariation"
const val METRIC_TABLE: String = "__metric"
const val CONVERT_USER_TABLE: String = "__convertUser"
const val CONVERT_COUNT_TABLE: String = "__convertCount"
const val VARIATION_COUNT_TABLE: String = "__variationCount"

const val INSERT_ACCESS_SQL =
    """INSERT INTO access_events (time, user_key, toggle_key, variation_index, rule_index, version, sdk_key) 
VALUES (?, ?, ?, ?, ?, ?, ?);"""

const val INSERT_CUSTOM_SQL =
    """INSERT INTO custom_events (time, user_key, name, value, sdk_key)
VALUES (?, ?, ?, ?, ?);"""

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "kind",
)
@JsonSubTypes(
    JsonSubTypes.Type(AccessEvent::class, name = "access"),
    JsonSubTypes.Type(CustomEvent::class, name = "custom")
)
@Suppress("unused")
sealed class Event(val kind: String)

data class AccessEvent(
    val time: Timestamp,
    val user: String,
    val toggle: String,
    val variationIndex: Int,
    val ruleIndex: Int?,
    val version: Int?,
) : Event("access")


data class CustomEvent(
    val time: Timestamp,
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
    val status: Int
)

data class AnalysisReport(
    val ctw: Map<String, Double>
)

sealed class AnalysisFailure

object NotSupportAnalysisType : AnalysisFailure()

data class VariationCount(val variation: String, val convert: Int, val all: Int)