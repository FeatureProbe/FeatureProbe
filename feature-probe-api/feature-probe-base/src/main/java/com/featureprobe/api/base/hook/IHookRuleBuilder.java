package com.featureprobe.api.base.hook;

import com.featureprobe.api.base.model.HookContext;

public interface IHookRuleBuilder {

    IHookRule build(Long settingId);

}
