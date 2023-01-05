package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.TargetingContent;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class TargetingApprovalRequest {

    private TargetingContent content;

    @Schema(description = "Release notes")
    private String comment;

    @Schema(description = "Disables the toggle.")
    private Boolean disabled;

    @Schema(description = "Set the reviewers for the approval")
    private List<String> reviewers;

}
