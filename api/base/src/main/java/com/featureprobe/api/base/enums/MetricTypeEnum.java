package com.featureprobe.api.base.enums;

public enum MetricTypeEnum {
    CONVERSION, NUMERIC, PAGE_VIEW, CLICK;

    public boolean equals(MetricTypeEnum type) {
        return this.name().equals(type.name());
    }
}
