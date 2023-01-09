package com.featureprobe.api.hook;

import com.featureprobe.api.base.hook.CallbackType;
import com.featureprobe.api.base.hook.ICallback;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@AllArgsConstructor
public class CallbackAbilityContainer {

    ApplicationContext applicationContext;

    private static final Map<String, ICallback> hooks = new HashMap<>();

    @PostConstruct
    public void init() {
        hooks.putAll(applicationContext.getBeansOfType(ICallback.class));
        log.info("Initialized {} Hook callback ability。", hooks.size());
    }

    public static ICallback get(CallbackType callbackType) {
        return hooks.get(callbackType.name());
    }

}
