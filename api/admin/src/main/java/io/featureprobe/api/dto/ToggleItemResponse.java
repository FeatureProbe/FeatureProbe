package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class ToggleItemResponse {

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

    @Schema(description = "The description of the toggle.")
    private String desc;

    @Schema(description = "The tags of the toggle.")
    private Set<String> tags;

    @Schema(description = "Whether the toggle is disabled.")
    private Boolean disabled;

    @Schema(description = "The time the toggle was last accessed")
    private Date visitedTime;

    @Schema(description = "The modification time of the toggle.")
    private Date modifiedTime;

    @Schema(description = "The editor of the toggle.")
    private String modifiedBy;

    @Schema(description = "Whether the modification lock of the toggle is occupied.")
    private boolean locked;

    @Schema(description = "Currently holds the toggle edit lock.")
    private String lockedBy;

    @Schema(description = "Toggle locked time.")
    private Date lockedTime;

    @Schema(description = "The release status of the toggle.")
    private ToggleReleaseStatusEnum releaseStatus;
}
