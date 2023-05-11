package io.featureprobe.api.base.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.apache.commons.collections4.CollectionUtils;

import java.util.List;

@Data
public class BaseRule {

    @Schema(description = "A collection of conditions evaluated by a single rule. " +
            "<br/> **Use AND(&) operation between multiple conditions.**")
    private List<ConditionValue> conditions;

    @JsonIgnore
    public boolean isNotEmptyConditions() {
        return CollectionUtils.isNotEmpty(conditions);
    }
}
