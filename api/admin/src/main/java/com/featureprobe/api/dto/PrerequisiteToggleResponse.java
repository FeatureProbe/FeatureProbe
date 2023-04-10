package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.Variation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class PrerequisiteToggleResponse {

    @Schema(description = "The name of the toggle.")
    private String name;

    @Schema(description = "The key of the toggle.")
    private String key;

    @Schema(description = "Return types decide the toggle's return type in you code.",
            allowableValues = {"boolean", "number", "string", "json"})
    private String returnType;

    @Schema(description = "Whether the toggle is disabled.")
    private Boolean disabled;

    private List<Variation> variations;
}
