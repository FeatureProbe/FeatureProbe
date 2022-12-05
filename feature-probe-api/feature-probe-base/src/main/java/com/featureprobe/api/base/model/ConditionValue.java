package com.featureprobe.api.base.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.featureprobe.sdk.server.model.Condition;
import com.featureprobe.sdk.server.model.ConditionType;
import com.featureprobe.sdk.server.model.PredicateType;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

@Data
public class ConditionValue {

    private String type;
    private String subject;

    private String predicate;
    private List<String> objects;

    public Condition toCondition() {
        Condition condition = new Condition();
        condition.setType(ConditionType.forValue(type));
        condition.setSubject(subject);
        condition.setPredicate(PredicateType.forValue(predicate));
        condition.setObjects(objects);
        return condition;
    }

    @JsonIgnore
    public boolean isSegmentType() {
        return StringUtils.equals(ConditionType.SEGMENT.toValue(), type);
    }

    @JsonIgnore
    public boolean isNumberType() {
        return StringUtils.equals(ConditionType.NUMBER.toValue(), type);
    }

    @JsonIgnore
    public boolean isDatetimeType() {
        return StringUtils.equals(ConditionType.DATETIME.toValue(), type);
    }

    @JsonIgnore
    public boolean isSemVerType() {
        return StringUtils.equals(ConditionType.SEMVER.toValue(), type);
    }

}
