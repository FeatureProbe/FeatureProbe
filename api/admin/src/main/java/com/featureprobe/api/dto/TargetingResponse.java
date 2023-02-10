package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.TargetingContent;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TargetingResponse {

    @Schema(description = "The built-in status of the targeting.", allowableValues = {"PENDING_APPROVAL",
            "PENDING_RELEASE", "REJECT", "RELEASE"})
    private String status;

    @Schema(description = "Is approval required.")
    private boolean enableApproval;

    @Schema(description = "The reviewers of the targeting approval.")
    private List<String> reviewers;

    @Schema(description = "The approval comment of the targeting.")
    private String approvalComment;

    @Schema(description = "Approve submitter")
    private String submitBy;

    @Schema(description = "Whether the modification lock of the toggle is occupied.")
    private boolean locked;

    @Schema(description = "Toggle locked time.")
    private Date lockedTime;

    @Schema(description = "The approver of the targeting.")
    private String approvalBy;

    @Schema(description = "Whether the targeting is disabled.")
    private Boolean disabled;

    private TargetingContent content;

    @Schema(description = "The version number of the targeting.")
    private Long version;

    @Schema(description = "The modification time of the targeting.")
    private Date modifiedTime;

    @Schema(description = "The publisher of the targeting.")
    private String modifiedBy;

    @Schema(description = "The publish time of the targeting.")
    private Date publishTime;

    @Schema(description = "Whether or not access events are tracked.")
    private Boolean trackAccessEvents;

    @Schema(description = "Whether to enable event tracking.")
    private Boolean allowEnableTrackAccessEvents;


}
