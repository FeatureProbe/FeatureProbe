package com.featureprobe.api.base.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.apache.commons.collections4.CollectionUtils;

import java.util.List;

@Data
public class BaseRule {

    private List<ConditionValue> conditions;

    @JsonIgnore
    public boolean isNotEmptyConditions() {
        return CollectionUtils.isNotEmpty(conditions);
    }
}
