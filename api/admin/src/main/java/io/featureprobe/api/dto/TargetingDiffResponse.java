package io.featureprobe.api.dto;

import io.featureprobe.api.base.model.TargetingContent;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class TargetingDiffResponse {

    @Schema(description = "Whether the currently sketch targeting is disabled.")
    private Boolean currentDisabled;
    @Schema(description = "The content of the currently sketch targeting.")
    private TargetingContent currentContent;

    @Schema(description = "Whether the currently published targeting is disabled.")
    private Boolean oldDisabled;

    @Schema(description = "The content of the currently published targeting.")
    private TargetingContent oldContent;

}
