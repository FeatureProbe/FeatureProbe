package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import com.featureprobe.api.base.enums.VisitFilter;
import com.featureprobe.api.base.model.PaginationRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class ToggleSearchRequest extends PaginationRequest {

    @Schema(description = "A unique key used to reference the environment.")
    private String environmentKey;

    @Schema(description = "A filter by access time.")
    private VisitFilter visitFilter;

    @Schema(description = "Whether the toggle is disabled.")
    private Boolean disabled;

    @Schema(description = "A filter by tags.")
    private List<String> tags;

    @Schema(description = "Fuzzy matching according to toggle name, key and description.")
    private String keyword;

    @Schema(description = "Whether the toggle is archived.", defaultValue = "false")
    private boolean archived;

    @Schema(description = "A filter by release status.")
    private List<ToggleReleaseStatusEnum> releaseStatusList;

    @Schema(description = "Whether the toggle is permanent.")
    private Boolean permanent;

    @Schema(description = "A filter by related to me.")
    private Boolean related;

}
