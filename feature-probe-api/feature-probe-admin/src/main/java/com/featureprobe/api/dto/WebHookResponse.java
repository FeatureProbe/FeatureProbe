package com.featureprobe.api.dto;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import lombok.Data;

import java.util.Date;

@Data
public class WebHookResponse {

    private Long id;

    private String name;

    private HookSettingsStatus status;

    private String url;

    private String secretKey;

    private String description;

    private Date createdTime;

    private String createdBy;

    private Date modifiedTime;

    private String modifiedBy;

}
