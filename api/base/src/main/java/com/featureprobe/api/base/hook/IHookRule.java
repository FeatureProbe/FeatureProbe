package com.featureprobe.api.base.hook;

import com.featureprobe.api.base.model.HookContext;

public interface IHookRule {

    boolean isHid(HookContext hookContext);

}
