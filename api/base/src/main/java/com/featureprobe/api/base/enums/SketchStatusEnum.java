package com.featureprobe.api.base.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public enum SketchStatusEnum {

    PENDING, REVOKE, RELEASE, CANCEL;

    private static final Map<String, SketchStatusEnum> namesMap = Arrays.stream(SketchStatusEnum.values())
            .collect(Collectors.toMap(pt -> pt.name(), pt -> pt));

    @JsonCreator
    public static SketchStatusEnum forValue(String value) {
        return namesMap.get(value);
    }
}
