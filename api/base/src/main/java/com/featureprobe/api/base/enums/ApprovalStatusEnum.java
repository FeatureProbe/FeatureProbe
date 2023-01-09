package com.featureprobe.api.base.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum ApprovalStatusEnum {
    PENDING,
    PASS,
    REJECT,
    JUMP,
    REVOKE;

    private static final Map<String, ApprovalStatusEnum> namesMap = Arrays.stream(ApprovalStatusEnum.values())
            .collect(Collectors.toMap(pt -> pt.name(), pt -> pt));

    @JsonCreator
    public static ApprovalStatusEnum forValue(String value) {
        return namesMap.get(value);
    }
}
