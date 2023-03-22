package com.featureprobe.api.base.enums;

import org.apache.commons.lang3.StringUtils;

public enum SDKType {
    Java("JAVA"),
    Python("PYTHON"),
    Rust("RUST"),
    Go("GO"),
    NodeJS("Node"),
    Android("ANDROID"),
    Swift("SWIFT"),
    ObjectiveC("OBJECTIVEC"),
    JavaScript("JS"),
    MiniProgram("MINIPROGRAM"),
    React("REACT");

    private final String value;

    private SDKType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static SDKType fromString(String value) {
        String trimmedValue = StringUtils.trim(value).replace(" ", "");
        for (SDKType sdkType : SDKType.values()) {
            if (sdkType.getValue().equalsIgnoreCase(trimmedValue)) {
                return sdkType;
            }
        }
        throw new IllegalArgumentException("Invalid SDKType value: " + value);
    }
}