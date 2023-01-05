package com.featureprobe.api.dto;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class WebHookCreateRequest {

    @Schema(description = "A human-friendly name for the webhook.")
    @NotBlank
    private String name;

    @Schema(description = "Built-in status for the webhook.")
    @NotBlank
    private HookSettingsStatus status;

    @Schema(description = "A signature authentication key for the webhook.")
    private String secretKey;

    @Schema(description = "The address will be callback when a system event occurs.")
    @NotBlank
    private String url;

    @Schema(description = "A custom description.")
    private String description;

}
