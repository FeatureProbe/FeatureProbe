package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.WinCriteria;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Set;

@Data
public class MetricResponse {

    @Schema(description = "The ID of the metric.")
    private Long id;

    @Schema(description = "The name of the metric.")
    private String name;

    @Schema(description = "The description of the metric.")
    private String description;

    @Schema(description = "The unit of the NUMERIC metric.")
    private String unit;

    @Schema(description = "The win criteria of the NUMERIC metric.")
    private WinCriteria winCriteria;

    @Schema(description = "The type of the metric.")
    private MetricTypeEnum type;

    private Set<EventResponse> events;

}
