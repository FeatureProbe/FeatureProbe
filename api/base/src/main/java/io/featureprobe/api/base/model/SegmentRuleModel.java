package io.featureprobe.api.base.model;

import com.featureprobe.sdk.server.model.SegmentRule;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.stream.Collectors;

@Data
public class SegmentRuleModel extends BaseRule {

    @Schema(description = "A human-friendly name for the rule.")
    String name;

    public SegmentRule toSegmentRule() {
        return new com.featureprobe.sdk.server.model.SegmentRule(getConditions().stream()
                .map(condition -> condition.toCondition()).collect(Collectors.toList()));
    }

}
