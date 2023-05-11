package io.featureprobe.api.base.enums;

public enum WinCriteria {

    NEGATIVE, POSITIVE;

    public boolean equals(WinCriteria type) {
        return this.name().equals(type.name());
    }
}
