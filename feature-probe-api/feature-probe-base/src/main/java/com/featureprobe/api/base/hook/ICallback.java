package com.featureprobe.api.base.hook;

import com.featureprobe.api.base.model.CallbackResult;
import com.featureprobe.api.base.model.HookContext;

public interface ICallback {

    CallbackResult callback(HookContext hookContext, String url, String secretKey);

}
