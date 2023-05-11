package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class CancelSketchRequest {

    @Schema(description = "A custom description.")
    private String comment;

}
