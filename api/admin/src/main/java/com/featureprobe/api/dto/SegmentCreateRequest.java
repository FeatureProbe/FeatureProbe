package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class SegmentCreateRequest {

    @Schema(description = "A human-friendly name for the new segment.")
    @NotBlank
    private String name;

    @Schema(description = "A project-unique key for the new segment.")
    @NotBlank
    private String key;

    @Schema(description = "A custom description for the new segment.")
    private String description;

}
