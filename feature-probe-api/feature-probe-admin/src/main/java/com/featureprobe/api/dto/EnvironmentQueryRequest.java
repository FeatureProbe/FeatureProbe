package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class EnvironmentQueryRequest {

    @Schema(description = "Archived or not", defaultValue = "false")
    private boolean archived;

}
