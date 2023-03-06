package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.AlgorithmDenominatorEnum;
import com.featureprobe.api.base.enums.EventTypeEnum;
import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.MatcherTypeEnum;
import com.featureprobe.api.base.enums.WinCriteria;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class MetricCreateRequest {

    @Schema(description = "The name of the metric.")
    @NotBlank
    private String name;

    @Schema(description = "The description of the metric.")
    private String description;

    @Schema(description = "The type of the metric.")
    @NotNull
    private MetricTypeEnum metricType;

    @Schema(description = "The type of the event.")
    @NotNull
    private EventTypeEnum eventType;

    @Schema(description = "The denominator of the metric.")
    @NotNull
    private AlgorithmDenominatorEnum denominator;

    @Schema(description = "The unit of the NUMERIC metric.")
    private String unit;

    @Schema(description = "The win criteria of the NUMERIC metric.")
    private WinCriteria winCriteria;

    @Schema(description = "The name of the event. Use the event name in the code buried point. <br/> " +
            "Only contain letters, numbers, '.', '_' Or '-', and the length is greater than 4.")
    private String eventName;

    @Schema(description = "The URL matching pattern.")
    private MatcherTypeEnum matcher = null;

    @Schema(description = "The url of the event.")
    private String url;

    @Schema(description = "The css selector of the event.")
    private String selector;

}
