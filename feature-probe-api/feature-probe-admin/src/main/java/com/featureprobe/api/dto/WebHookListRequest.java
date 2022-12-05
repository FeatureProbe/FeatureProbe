package com.featureprobe.api.dto;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import com.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

@Data
public class WebHookListRequest extends PaginationRequest {

    private String nameLike;

    private HookSettingsStatus status;

}
