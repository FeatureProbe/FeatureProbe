package io.featureprobe.api.base.enums;

public enum TrafficType {

    VALUE, NAME;

    public boolean isNameType() {
        return this.name().equals(TrafficType.NAME.name());

    }
}
