package com.featureprobe.api.dto;
import java.util.List;
import lombok.Data;

@Data
public class ApprovalSettingsResponse {

    private String environmentKey;

    private String environmentName;

    private Boolean enable;

    private List<String> reviewers;

    private boolean locked;

}
