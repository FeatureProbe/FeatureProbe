package com.featureprobe.api.dto;

import com.featureprobe.api.base.hook.Action;
import com.featureprobe.api.base.hook.Resource;
import lombok.Data;

@Data
public class WebHookCallbackResponse {

    private Long organizationId;

    private Resource resource;

    private Action action;

    private String operator;

    private Long date;

    private Object data;

    public WebHookCallbackResponse(Resource resource, Action action) {
        this.resource = resource;
        this.action = action;
        this.date = System.currentTimeMillis();
    }

}
