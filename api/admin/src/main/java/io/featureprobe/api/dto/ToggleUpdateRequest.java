package io.featureprobe.api.dto;

import io.featureprobe.api.base.model.Variation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;


@Data
public class ToggleUpdateRequest {

    @Schema(description = "A human-friendly name for the new toggle.")
    private String name;

    @Schema(description = "A custom description for the new toggle.")
    private String desc;

    @Schema(description = "Put some tag for the new toggle.")
    private List<String> tags;

    @Schema(description = "Whether to use in the client-side SDK.")
    private Boolean clientAvailability;

    @Schema(description = "Variations decide the toggles return value in yue code. " +
            "<br/> **It is only used for toggle initialization when creating a new environment, " +
            "and does not take effect for the current existing environment**")
    private List<Variation> variations;

    @Schema(description = "Define the return value when toggle is disabled. " +
            "<br/> **It is only used for toggle initialization when creating a new environment," +
            " and does not take effect for the current existing environment**")
    private Integer disabledServe;

    @Schema(description = "Whether the toggle is permanent.", defaultValue = "false")
    private boolean permanent;
}
