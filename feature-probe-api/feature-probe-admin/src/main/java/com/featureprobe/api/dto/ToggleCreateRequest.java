package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.Variation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;


@Data
public class ToggleCreateRequest {

    @Schema(description = "A human-friendly name for the new toggle.")
    @NotBlank
    private String name;

    @Schema(description = "A project-unique key for the new toggle.")
    @NotBlank
    private String key;

    @Schema(description = "A custom description for the new toggle.")
    private String desc;

    @Schema(description = "Put some tag for the new toggle.")
    private List<String> tags;

    @Schema(description = "Whether to use in the client-side SDK.")
    @NotNull
    private Boolean clientAvailability;

    @Schema(description = "Return types decide the toggle's return type in you code.",
            allowableValues = {"boolean", "number", "string", "json"})
    @NotBlank
    private String returnType;

    @Schema(description = "Variations decide the toggles return value in yue code.")
    @NotEmpty
    private List<Variation> variations;

    @Schema(description = "Define the return value when toggle is disabled.")
    @NotNull
    private Integer disabledServe;

    @Schema(description = "Whether the toggle is permanent.", defaultValue = "false")
    private boolean permanent;
}
