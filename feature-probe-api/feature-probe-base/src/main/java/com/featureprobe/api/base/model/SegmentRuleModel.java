package com.featureprobe.api.base.model;

import com.featureprobe.sdk.server.model.SegmentRule;
import lombok.Data;

import java.util.stream.Collectors;

@Data
public class SegmentRuleModel extends BaseRule {

    String name;

    public SegmentRule toSegmentRule() {
        return new com.featureprobe.sdk.server.model.SegmentRule(getConditions().stream()
                .map(condition -> condition.toCondition()).collect(Collectors.toList()));
    }

}
