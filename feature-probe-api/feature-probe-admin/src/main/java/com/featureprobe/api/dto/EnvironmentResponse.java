package com.featureprobe.api.dto;

import lombok.Data;

@Data
public class EnvironmentResponse {

    private String name;

    private String key;

    private boolean enableApproval;

    private String serverSdkKey;
    private String clientSdkKey;

}
