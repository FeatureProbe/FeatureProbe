package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectCreateRequest {

    @Schema(description = "A human-friendly name for the new project.")
    @NotBlank
    private String name;

    @Schema(description = "A organization-unique key for the new project.")
    @NotBlank
    private String key;

    @Schema(description = "A custom description for the new project.")
    private String description;

}
