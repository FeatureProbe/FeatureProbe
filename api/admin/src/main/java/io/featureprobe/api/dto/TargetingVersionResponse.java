package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.ApprovalStatusEnum;
import io.featureprobe.api.base.model.TargetingContent;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
public class TargetingVersionResponse {

    @Schema(description = "The key of the project.")
    private String projectKey;

    @Schema(description = "The key of the environment.")
    private String environmentKey;

    @Schema(description = "The key of the toggle.")
    private String toggleKey;

    @Schema(description = "The release note of the targeting version.")
    private String comment;

    private TargetingContent content;

    @Schema(description = "The disabled of the targeting version.")
    private Boolean disabled;

    @Schema(description = "The version number of the targeting version.")
    private Long version;

    @Schema(description = "The creation time of the targeting version.")
    private Date createdTime;

    @Schema(description = "The creator time of the targeting version.")
    private String createdBy;

    @Schema(description = "The approval status of the targeting version.")
    private ApprovalStatusEnum approvalStatus;

    @Schema(description = "The approver of the targeting version.")
    private String approvalBy;

    @Schema(description = "The approval time of the targeting version.")
    private Date approvalTime;

    @Schema(description = "The approval comment of the targeting version.")
    private String approvalComment;
}
