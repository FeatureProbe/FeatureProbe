package com.featureprobe.api.base.model;

import com.featureprobe.sdk.server.model.Rule;
import com.featureprobe.sdk.server.model.Serve;
import lombok.Data;

import java.util.stream.Collectors;

@Data
public class ToggleRule extends BaseRule {

    String name;
    ServeValue serve;

    public Rule toRule() {
        Serve sdkServe = serve.toServe();
        return new Rule(sdkServe, getConditions().stream()
                .map(condition -> condition.toCondition()).collect(Collectors.toList()));
    }
}
