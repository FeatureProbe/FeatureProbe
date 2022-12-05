package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class ApprovalRecordResponse {

    private String title;

    private String projectName;

    private String projectKey;

    private String toggleName;

    private String toggleKey;

    private String environmentName;

    private String environmentKey;

    private ApprovalStatusEnum status;

    private String submitBy;

    private boolean locked;

    private Date lockedTime;

    private List<String> reviewers;

    private String approvedBy;

    private String comment;

    private Date createdTime;

    private Date modifiedTime;

    private boolean canceled;

    private String cancelReason;

}
