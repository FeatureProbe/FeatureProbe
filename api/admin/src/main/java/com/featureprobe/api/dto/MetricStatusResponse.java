package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class MetricStatusResponse {
    @Schema(description = "Whether the toggle is report metric successfully.")
    private Boolean isReport;

}
