package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class ToggleControlConfRequest {

    @Schema(description = "Whether or not access events are tracked.")
    private Boolean trackAccessEvents;

}
