package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.TargetingContent;
import lombok.Data;

import java.util.List;

@Data
public class TargetingApprovalRequest {

    private TargetingContent content;

    private String comment;

    private Boolean disabled;

    private List<String> reviewers;

}
