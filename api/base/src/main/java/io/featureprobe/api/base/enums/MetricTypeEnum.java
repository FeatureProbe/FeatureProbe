package io.featureprobe.api.base.enums;

public enum MetricTypeEnum {

    CONVERSION, COUNT, AVERAGE, SUM;

    public boolean equals(MetricTypeEnum type) {
        return this.name().equals(type.name());
    }
}
