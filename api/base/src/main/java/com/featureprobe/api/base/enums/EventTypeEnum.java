package com.featureprobe.api.base.enums;

public enum EventTypeEnum {
    CUSTOM, PAGE_VIEW, CLICK;

    public boolean equals(EventTypeEnum type) {
        return this.name().equals(type.name());
    }
}
