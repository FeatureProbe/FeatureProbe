package com.featureprobe.api.hook;

import com.featureprobe.api.base.hook.IHookRule;
import com.featureprobe.api.base.hook.IHookRuleBuilder;
import org.springframework.stereotype.Component;

@Component
public class DefaultHookRuleBuilder implements IHookRuleBuilder {

    @Override
    public IHookRule build(Long settingsId) {
        return new DefaultHookRule();
    }

}
