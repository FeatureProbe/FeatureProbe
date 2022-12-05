package com.featureprobe.api.event;

import com.featureprobe.api.base.model.CallbackResult;
import org.springframework.context.ApplicationEvent;
import java.time.Clock;

public class WebHookPostEvent extends ApplicationEvent {

    private Long organizationId;

    private String name;

    private CallbackResult callbackResult;

    public WebHookPostEvent(Long organizationId, String name, CallbackResult callbackResult, Object source) {
        super(source);
        this.organizationId = organizationId;
        this.name = name;
        this.callbackResult = callbackResult;
    }

    public WebHookPostEvent(Object source) {
        super(source);
    }

    public WebHookPostEvent(Object source, Clock clock) {
        super(source, clock);
    }

    public CallbackResult getCallbackResult() {
        return callbackResult;
    }

    public void setCallbackResult(CallbackResult callbackResult) {
        this.callbackResult = callbackResult;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
