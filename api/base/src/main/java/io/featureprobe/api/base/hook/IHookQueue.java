package io.featureprobe.api.base.hook;

import io.featureprobe.api.base.model.HookContext;

public interface IHookQueue {

    boolean push(HookContext hookContext);

    HookContext take() throws Exception;

}
