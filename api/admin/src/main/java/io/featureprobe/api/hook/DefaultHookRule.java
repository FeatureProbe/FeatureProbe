package io.featureprobe.api.hook;

import io.featureprobe.api.base.hook.IHookRule;
import io.featureprobe.api.base.model.HookContext;

public class DefaultHookRule implements IHookRule {

    @Override
    public boolean isHid(HookContext hookContext) {
        return true;
    }

}
