package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class EnvironmentResponse {

    @Schema(description = "The name of the environment.")
    private String name;

    @Schema(description = "The key of the environment.")
    private String key;

    @Schema(description = "Whether to enable approval.")
    private boolean enableApproval;

    @Schema(description = "The server-side sdk key of the environment.")
    private String serverSdkKey;

    @Schema(description = "The client-side sdk key of the environment.")
    private String clientSdkKey;

}
