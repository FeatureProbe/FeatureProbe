package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.Date;

@Data
public class ApprovalResponse {

    @Schema(description = "")
    private String title;

    @Schema(description = "The key of the project.")
    private String projectKey;

    @Schema(description = "The key of the environment.")
    private String environmentKey;

    @Schema(description = "The key of the toggle.")
    private String toggleKey;

    @Schema(description = "The built-in status for the approval.")
    private ApprovalStatusEnum status;

    @Schema(description = "The reviewers of the approval.")
    private String viewers;

    @Schema(description = "The comment of the approval.")
    private String comment;

    @Schema(description = "The approver of the approval.")
    private String approvalBy;

    @Schema(description = "The submitter of the approval.")
    private String submitBy;

    @Schema(description = "The approval date of the approval.")
    private Date approvalDate;

    @Schema(description = "Current targeting content.")
    private Object currentData;

    @Schema(description = "Submit approval targeting content.")
    private Object approvalData;

}
