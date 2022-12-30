package com.featureprobe.api.dto;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class WebHookUpdateRequest {

    @NotBlank
    private String name;

    private HookSettingsStatus status;

    private String secretKey;

    @NotBlank
    private String url;

    private String description;

}
