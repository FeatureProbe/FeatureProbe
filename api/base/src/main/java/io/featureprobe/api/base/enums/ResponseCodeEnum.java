package io.featureprobe.api.base.enums;

public enum ResponseCodeEnum {

    SUCCESS("200", "success");

    private final String code;

    private final String message;

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
