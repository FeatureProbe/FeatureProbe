package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.Variation;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
public class ToggleResponse {

    @Schema(description = "The name of the toggle.")
    private String name;

    @Schema(description = "The key of the toggle.")
    private String key;

    @Schema(description = "Whether the toggle is permanent.")
    private Boolean permanent;

    @Schema(description = "The number of days the toggle has been used.")
    private Long useDays;

    @Schema(description = "Return types decide the toggle's return type in you code.",
            allowableValues = {"boolean", "number", "string", "json"})
    private String returnType;

    @Schema(description = "Define the return value when toggle is disabled.")
    private Integer disabledServe;

    @Schema(description = "Whether the toggle is archived.")
    private Boolean archived;

    @Schema(description = "The description of the toggle.")
    private String desc;

    @Schema(description = "Variations decide the toggles return value in yue code.")
    private List<Variation> variations;

    @Schema(description = "Whether to use in the client-side SDK.")
    private Boolean clientAvailability;

    @Schema(description = "The tags of the toggle.")
    private Set<String> tags;

    @Schema(description = "The creation time of the toggle.")
    private Date createdTime;

    @Schema(description = "The modification time of the toggle.")
    private Date modifiedTime;

    @Schema(description = "The editor of the toggle.")
    private String modifiedBy;

}
