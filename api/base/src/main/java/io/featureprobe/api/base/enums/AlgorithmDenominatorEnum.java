package io.featureprobe.api.base.enums;

public enum AlgorithmDenominatorEnum {

    TOTAL_SAMPLE, TOTAL_PV;

    public boolean equals(AlgorithmDenominatorEnum denominator) {
        return this.name().equals(denominator.name());
    }
}
