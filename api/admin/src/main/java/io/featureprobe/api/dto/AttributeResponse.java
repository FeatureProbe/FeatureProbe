package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class AttributeResponse {

    @Schema(description = "The key of the attribute.")
    private String key;

}
