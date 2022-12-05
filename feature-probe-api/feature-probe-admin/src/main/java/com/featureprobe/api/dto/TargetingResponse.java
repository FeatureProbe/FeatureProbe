package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.TargetingContent;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TargetingResponse {

    private String status;

    private boolean enableApproval;

    private List<String> reviewers;

    private String approvalComment;

    private String submitBy;

    private boolean locked;

    private Date lockedTime;

    private String approvalBy;

    private Boolean disabled;

    private TargetingContent content;

    private Long version;

    private Date modifiedTime;

    private String modifiedBy;

    private Date publishTime;

}
