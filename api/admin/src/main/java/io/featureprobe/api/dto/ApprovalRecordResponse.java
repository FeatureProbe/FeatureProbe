package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.ApprovalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ApprovalRecordResponse {

    @Schema(description = "The title of the approval record.")
    private String title;

    @Schema(description = "The name of the project.")
    private String projectName;

    @Schema(description = "The key of the project.")
    private String projectKey;

    @Schema(description = "The name of the toggle.")
    private String toggleName;

    @Schema(description = "The key of the toggle.")
    private String toggleKey;

    @Schema(description = "The name of the environment.")
    private String environmentName;

    @Schema(description = "The key of the environment.")
    private String environmentKey;

    @Schema(description = "The built-in status for the approval record.")
    private ApprovalStatusEnum status;

    @Schema(description = "The applicant of the approval record.")
    private String submitBy;

    @Schema(description = "Whether the toggle lock is occupied.")
    private boolean locked;

    @Schema(description = "Toggle lock is occupied date.")
    private Date lockedTime;

    @Schema(description = "The reviewers of the approval record.")
    private List<String> reviewers;

    @Schema(description = "The approver for current status.")
    private String approvedBy;

    @Schema(description = "The comment of the approval record.")
    private String comment;

    @Schema(description = "The creation time of the approval record.")
    private Date createdTime;

    @Schema(description = "The modification time of the approval record.")
    private Date modifiedTime;

    @Schema(description = "Whether the approval record has been revoke.")
    private boolean canceled;

    @Schema(description = "The reason for revoke.")
    private String cancelReason;

}
