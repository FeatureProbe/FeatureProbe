package io.featureprobe.api.base.hook;

import io.featureprobe.api.base.model.HookContext;

public interface IHookRule {

    boolean isHid(HookContext hookContext);

}
