package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class EnvironmentUpdateRequest {

    @Schema(description = "A human-friendly name for the environment.")
    private String name;

    @Schema(description = "Choose whether to reset the server sdk key.", defaultValue = "false")
    private boolean resetServerSdk;

    @Schema(description = "Choose whether to reset the client sdk key.", defaultValue = "false")
    private boolean resetClientSdk;

}
