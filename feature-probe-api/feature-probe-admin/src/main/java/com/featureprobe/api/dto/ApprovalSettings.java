package com.featureprobe.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class ApprovalSettings {

    private String environmentKey;

    private String environmentName;

    private Boolean enable;

    private List<String> reviewers;

    private boolean locked;

}
