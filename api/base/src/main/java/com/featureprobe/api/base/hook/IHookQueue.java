package com.featureprobe.api.base.hook;

import com.featureprobe.api.base.model.HookContext;

public interface IHookQueue {

    boolean push(HookContext hookContext);

    HookContext take() throws Exception;

}
