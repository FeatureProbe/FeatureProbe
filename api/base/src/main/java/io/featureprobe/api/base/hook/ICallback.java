package io.featureprobe.api.base.hook;

import io.featureprobe.api.base.model.CallbackResult;
import io.featureprobe.api.base.model.HookContext;

public interface ICallback {

    CallbackResult callback(HookContext hookContext, String url, String secretKey);

}
