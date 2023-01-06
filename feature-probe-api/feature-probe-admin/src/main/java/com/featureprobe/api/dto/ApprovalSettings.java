package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class ApprovalSettings {

    @Schema(description = "A unique key used to reference the environment.")
    private String environmentKey;

    @Schema(description = "Enable Approval.")
    private Boolean enable;

    @Schema(description = "Configure reviewers account")
    private List<String> reviewers;

}
