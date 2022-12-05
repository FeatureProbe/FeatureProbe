package com.featureprobe.api.base.enums;

public enum MetricType {

    VALUE, NAME;


    public boolean isNameType() {
        return this == MetricType.NAME;

    }
}
