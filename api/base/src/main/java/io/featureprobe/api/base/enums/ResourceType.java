package io.featureprobe.api.base.enums;

import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;

public enum ResourceType {
    PROJECT("projectKey"), TOGGLE("toggleKey"), ENVIRONMENT("environmentKey"),
    TARGETING("projectKey_environmentKey_toggleKey"), MEMBER("account"),
    SEGMENT("segment"), DICTIONARY("dictionary"),
    ORGANIZATION_MEMBER("organization_member"),
    WEBHOOK("name"),
    ACCESS_TOKEN("access_token"),
    METRIC("projectKey_environmentKey_toggleKey"),

    TOGGLE_CONTROL_CONF("projectKey_environmentKey_toggleKey"), ORGANIZATION("organization");

    private final String paramName;

    ResourceType(String paramName) {
        this.paramName = paramName;
    }

    public String getParamName() {
        return paramName;
    }

    public static ResourceType of(String paramName) {
        return Arrays.stream(ResourceType.values()).filter(resourceType -> StringUtils.equals(resourceType.paramName,
                paramName)).findFirst().orElse(null);
    }
}
