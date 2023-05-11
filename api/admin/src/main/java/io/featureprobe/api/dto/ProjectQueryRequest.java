package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ProjectQueryRequest {

    @Schema(description = "Fuzzy matching according to project name.")
    private String keyword;

}
