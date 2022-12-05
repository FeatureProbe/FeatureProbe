package com.featureprobe.api.base.model;

import lombok.Data;

import java.util.Date;

@Data
public class CallbackResult {

    private boolean isSuccess;

    private int statusCode;

    private Date time;

    private String requestBody;

    private String responseBody;

    private String errorMessage;

}
