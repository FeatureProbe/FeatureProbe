package com.featureprobe.api.dto;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
public class WebHookResponse {

    @Schema(description = "The ID of the webhook.")
    private Long id;

    @Schema(description = "The name of the webhook.")
    private String name;

    @Schema(description = "Built-in status for the webhook.")
    private HookSettingsStatus status;

    @Schema(description = "The url of the webhook.")
    private String url;

    @Schema(description = "The secret key of the webhook.")
    private String secretKey;

    @Schema(description = "The description of the webhook.")
    private String description;

    @Schema(description = "The creation time of the webhook.")
    private Date createdTime;

    @Schema(description = "The creator of the webhook.")
    private String createdBy;

    @Schema(description = "The modification time of the webhook.")
    private Date modifiedTime;

    @Schema(description = "The editor of the webhook")
    private String modifiedBy;

}
