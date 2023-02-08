package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TrafficPoint {

    @Schema(description = "The abscissa point name of the metrics.")
    String name;

    @Schema(description = "")
    List<VariationAccessCounter> values;

    @Schema(description = "The version number of the last change in the time period.")
    Long lastChangeVersion;

    @Schema(description = "A number used for sorting.")
    Integer sorted;

}
