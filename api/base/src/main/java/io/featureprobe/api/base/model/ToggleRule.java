package io.featureprobe.api.base.model;

import com.featureprobe.sdk.server.model.Rule;
import com.featureprobe.sdk.server.model.Serve;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.stream.Collectors;

@Data
public class ToggleRule extends BaseRule {

    @Schema(description = "A human-friendly name for the rule.")
    String name;
    ServeValue serve;

    public Rule toRule() {
        Serve sdkServe = serve.toServe();
        return new Rule(sdkServe, getConditions().stream()
                .map(condition -> condition.toCondition()).collect(Collectors.toList()));
    }
}
