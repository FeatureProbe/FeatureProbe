package com.featureprobe.api.base.enums;

public enum MatcherTypeEnum {
    SIMPLE, EXACT, SUBSTRING, REGULAR;

    public boolean equals(MatcherTypeEnum type) {
        return this.name().equals(type.name());
    }
}
