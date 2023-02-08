package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.MetricTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Set;

@Data
public class MetricResponse {

    @Schema(description = "The ID of the event.")
    private Long id;

    @Schema(description = "The type of the event.")
    private MetricTypeEnum type;

    private Set<EventResponse> events;

}
