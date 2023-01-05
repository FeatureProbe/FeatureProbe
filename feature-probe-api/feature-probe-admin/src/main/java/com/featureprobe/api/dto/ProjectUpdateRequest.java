package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ProjectUpdateRequest {

    @Schema(description = "A human-friendly name for the new project.")
    private String name;

    @Schema(description = "A custom description for the new project.")
    private String description;

}
