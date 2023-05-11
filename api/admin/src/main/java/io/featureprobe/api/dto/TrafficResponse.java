package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TrafficResponse {

    @Schema(description = "Whether the toggle is access successfully.")
    private Boolean isAccess;

    private List<TrafficPoint> traffic;

    private List<VariationAccessCounter> summary;

}
