package com.featureprobe.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.featureprobe.api.base.model.TargetingContent;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TargetingPublishRequest extends ToggleControlConfRequest {

    public TargetingPublishRequest(TargetingContent content, String comment, Boolean disabled,
                                   ToggleControlConfRequest toggleControlConfRequest) {
        this.content = content;
        this.comment = comment;
        this.disabled = disabled;
        if (toggleControlConfRequest != null) {
            this.setTrackAccessEvents(toggleControlConfRequest.getTrackAccessEvents());
        }
    }


    private TargetingContent content;

    @Schema(description = "Release notes")
    private String comment;

    @Schema(description = "Disables the toggle.")
    private Boolean disabled;

    @Schema(description = "The current updated version.")
    private Long baseVersion;

    @JsonIgnore
    public Boolean isUpdateTargetingRules() {
        return disabled != null || content != null;
    }

}