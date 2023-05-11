package io.featureprobe.api.hook;

import io.featureprobe.api.base.hook.IHookRule;
import io.featureprobe.api.base.hook.IHookRuleBuilder;
import org.springframework.stereotype.Component;

@Component
public class DefaultHookRuleBuilder implements IHookRuleBuilder {

    @Override
    public IHookRule build(Long settingsId) {
        return new DefaultHookRule();
    }

}
