package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ToggleSegmentResponse {

    @Schema(description = "The name of the toggle.")
    private String name;

    @Schema(description = "The key of the toggle.")
    private String key;

    @Schema(description = "The name of the environment.")
    private String environmentName;

    @Schema(description = "The key of the environment.")
    private String environmentKey;

    @Schema(description = "Whether the toggle is disabled.")
    private Boolean disabled;

    @Schema(description = "The description of the toggle.")
    private String description;

    @Schema(description = "Toggle for whether metric analysis is in progress.")
    private boolean analyzing;

}
