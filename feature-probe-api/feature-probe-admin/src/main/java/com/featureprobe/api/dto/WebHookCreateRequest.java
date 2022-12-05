package com.featureprobe.api.dto;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class WebHookCreateRequest {

    @NotBlank
    private String name;

    private HookSettingsStatus status;

    @NotBlank
    private String url;

    private String description;

}
