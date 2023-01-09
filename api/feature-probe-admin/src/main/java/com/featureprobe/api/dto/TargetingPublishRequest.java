package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.TargetingContent;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TargetingPublishRequest {

    private TargetingContent content;

    @Schema(description = "Release notes")
    private String comment;

    @Schema(description = "Disables the toggle.")
    private Boolean disabled;

}