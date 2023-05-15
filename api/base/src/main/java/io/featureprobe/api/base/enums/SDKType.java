package io.featureprobe.api.base.enums;

import org.apache.commons.lang3.StringUtils;

public enum SDKType {
    Java("Java"),
    Python("Python"),
    Rust("Rust"),
    Go("Go"),
    NodeJS("Node"),
    Android("Android"),
    Swift("iOS"),
    ObjectiveC("iOS"),
    JavaScript("JS"),
    MiniProgram("MINIPROGRAM"),
    React("REACT");

    private final String value;

    SDKType(String value) {
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
