package com.featureprobe.api.hook;

import com.featureprobe.api.base.hook.ICallback;
import com.featureprobe.api.base.hook.IHookRule;
import com.featureprobe.api.base.model.CallbackResult;
import com.featureprobe.api.base.model.HookContext;
import com.featureprobe.api.event.WebHookPostEvent;
import lombok.Data;
import org.springframework.context.ApplicationEventPublisher;

@Data
public class WebHook {

    private Long organizationId;

    private String name;

    private ICallback hook;

    private IHookRule rule;

    private String url;

    private String secretKey;

    public void callback(HookContext hookContext, ApplicationEventPublisher eventPublisher) {
        if (rule.isHid(hookContext)) {
            CallbackResult result = hook.callback(hookContext, url, secretKey);
            WebHookPostEvent postEvent = new WebHookPostEvent(organizationId, name, result, this);
            eventPublisher.publishEvent(postEvent);
        }
    }

}
