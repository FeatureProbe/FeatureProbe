package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class VariationAccessCounterRequest {

    @Schema(description = "The total number of hits for the variation.")
    @NotNull
    private Long count;

    @Schema(description = "The version of the variation.")
    @NotNull
    private Long version;

    @Schema(description = "The index of the variations.")
    @NotNull
    private Integer index;

    @Schema(description = "The value of the variations.")
    private Object value;

}
