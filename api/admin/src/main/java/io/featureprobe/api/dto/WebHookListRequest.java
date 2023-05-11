package io.featureprobe.api.dto;

import io.featureprobe.api.base.hook.HookSettingsStatus;
import io.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

@Data
public class WebHookListRequest extends PaginationRequest {

    private String nameLike;

    private HookSettingsStatus status;

}
