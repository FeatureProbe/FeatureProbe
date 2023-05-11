package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class DependentToggleResponse {

    @Schema(description = "The name of the toggle.")
    private String name;

    @Schema(description = "The key of the toggle.")
    private String key;

    @Schema(description = "Whether the toggle is disabled.")
    private Boolean disabled;

    @Schema(description = "The dependent value of the toggle prerequisite.")
    private String dependentValue;
}
