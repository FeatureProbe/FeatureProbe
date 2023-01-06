package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MetricResponse {

    @Schema(description = "Whether the toggle is access successfully.")
    private Boolean isAccess;

    private List<AccessEventPoint> metrics;

    private List<VariationAccessCounter> summary;

}
