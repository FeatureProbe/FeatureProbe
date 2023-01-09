package com.featureprobe.api.hook;

import com.featureprobe.api.base.hook.IHookRule;
import com.featureprobe.api.base.model.HookContext;

public class DefaultHookRule implements IHookRule {

    @Override
    public boolean isHid(HookContext hookContext) {
        return true;
    }

}
