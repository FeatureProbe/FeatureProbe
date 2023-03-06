package com.featureprobe.api.base.enums;

public enum MetricTypeEnum {

    CONVERSION, COUNT, DURATION, REVENUE;

    public boolean equals(MetricTypeEnum type) {
        return this.name().equals(type.name());
    }
}
