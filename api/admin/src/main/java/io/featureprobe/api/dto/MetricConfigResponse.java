package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.AlgorithmDenominatorEnum;
import io.featureprobe.api.base.enums.EventTypeEnum;
import io.featureprobe.api.base.enums.MatcherTypeEnum;
import io.featureprobe.api.base.enums.MetricTypeEnum;
import io.featureprobe.api.base.enums.WinCriteria;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MetricConfigResponse {

    @Schema(description = "The ID of the metric.")
    private Long id;

    @Schema(description = "The type of the metric.")
    private MetricTypeEnum metricType;

    @Schema(description = "The name of the metric.")
    private String name;

    @Schema(description = "The description of the metric.")
    private String description;

    @Schema(description = "The unit of the NUMERIC metric.")
    private String unit;

    @Schema(description = "The win criteria of the NUMERIC metric.")
    private WinCriteria winCriteria;

    @Schema(description = "The denominator of the metric.")
    private AlgorithmDenominatorEnum denominator;

    @Schema(description = "The type of the event.")
    private EventTypeEnum eventType;

    @Schema(description = "The name of the event. Use the event name in the code buried point. <br/> " +
            "Only contain letters, numbers, '.', '_' Or '-', and the length is greater than 4.")
    private String eventName;

    @Schema(description = "The URL matching pattern.")
    private MatcherTypeEnum matcher;

    @Schema(description = "The url of the event.")
    private String url;

    @Schema(description = "The css selector of the event.")
    private String selector;


}
