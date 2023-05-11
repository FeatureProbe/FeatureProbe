package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class ProjectResponse {

    @Schema(description = "The name of the project.")
    private String name;

    @Schema(description = "The key of the project.")
    private String key;

    @Schema(description = "The description of project.")
    private String description;

    @Schema(description = "All environments in the project.")
    private List<EnvironmentResponse> environments;

}
