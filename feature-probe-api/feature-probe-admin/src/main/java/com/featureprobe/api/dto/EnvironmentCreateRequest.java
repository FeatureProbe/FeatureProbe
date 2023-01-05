package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class EnvironmentCreateRequest {

    @Schema(description = "A human-friendly name for the new environment.")
    @NotBlank
    private String name;

    @Schema(description = "A project-unique key for the new environment.")
    @NotBlank
    private String key;
}
