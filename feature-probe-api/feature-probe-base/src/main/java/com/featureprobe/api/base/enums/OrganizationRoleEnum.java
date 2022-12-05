package com.featureprobe.api.base.enums;

public enum OrganizationRoleEnum {

    OWNER, WRITER;

    public boolean isOwner() {
        return this == OWNER;
    }

}