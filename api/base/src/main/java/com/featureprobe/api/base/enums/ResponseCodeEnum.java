package com.featureprobe.api.base.enums;

public enum ResponseCodeEnum {

    SUCCESS("success", "success");

    private String code;

    private String message;

    ResponseCodeEnum(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String code() {
        return code;
    }

    public String message() {
        return message;
    }
}
