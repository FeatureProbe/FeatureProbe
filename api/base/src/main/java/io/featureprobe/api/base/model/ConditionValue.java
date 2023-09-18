package io.featureprobe.api.base.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.featureprobe.sdk.server.model.Condition;
import com.featureprobe.sdk.server.model.ConditionType;
import com.featureprobe.sdk.server.model.PredicateType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Data
public class ConditionValue {

    @Schema( description = "The type of rule.", allowableValues = {"string", "number", "semver", "datetime"})
    private String type;

    @Schema(description = "Target user attribute name.")
    private String subject;

    @Schema(description = "Target user attribute matching rules. " +
            "<br/> string type allowable values ['is one of', 'ends with', 'starts with', 'contains', " +
            "'matches regex', 'is not any of', 'does not end with', 'does not start with', 'does not contain', " +
            "'does not match regex']. <br/> number and semver type allowable " +
            "values ['=', '!=', '>', '>=', '<', '<=', 'between']. " +
            "<br/> datetime type allowable ['after', 'before', between].")
    private String predicate;

    @Schema(description = "Target user attribute matching rules. Incremental Implementation for the 'Between' Rule." +
            "<br/> number type allowable values ['>', '>=', '<', '<='], datetime type allowable ['after', 'before'].")
    private String leftPredicate;

    @Schema(description = "Target user matching attribute Values.")
    private List<String> objects;

    @Schema(description = "Target user attribute matching rules. Incremental Implementation for the 'Between' Rule." +
            "<br/> number type allowable values ['>', '>=', '<', '<='], datetime type allowable ['after', 'before'].")
    private String rightPredicate;

    @Schema(description = "Target user matching attribute Values.  Incremental Implementation for the 'Between' Rule.")
    private List<String> rightObjects;

    public List<Condition> toCondition() {
        if ("between".equals(predicate)) {
            return betweenConditionTranslate();
        } else {
            List<Condition> conditions = new ArrayList<>(1);
            Condition condition = new Condition();
            condition.setType(ConditionType.forValue(type));
            condition.setSubject(subject);
            condition.setPredicate(PredicateType.forValue(predicate));
            condition.setObjects(objects);
            conditions.add(condition);
            return conditions;
        }
    }

    private List<Condition> betweenConditionTranslate() {
        List<Condition> conditions = new ArrayList<>(2);
        Condition leftConditions = new Condition();
        leftConditions.setType(ConditionType.forValue(type));
        leftConditions.setSubject(subject);
        leftConditions.setPredicate(PredicateType.forValue(leftPredicate));
        leftConditions.setObjects(objects);
        Condition rightConditions = new Condition();
        BeanUtils.copyProperties(leftConditions, rightConditions);
        rightConditions.setPredicate(PredicateType.forValue(rightPredicate));
        rightConditions.setObjects(rightObjects);
        conditions.add(leftConditions);
        conditions.add(rightConditions);
        return conditions;
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
