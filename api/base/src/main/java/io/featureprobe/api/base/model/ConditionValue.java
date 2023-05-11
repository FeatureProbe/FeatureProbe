package io.featureprobe.api.base.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.featureprobe.sdk.server.model.Condition;
import com.featureprobe.sdk.server.model.ConditionType;
import com.featureprobe.sdk.server.model.PredicateType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;

import java.util.List;

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
            "values ['=', '!=', '>', '>=', '<', '<=']. <br/> datetime type allowable ['after', 'before'].")
    private String predicate;

    @Schema(description = "Target user matching attribute Values.")
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
