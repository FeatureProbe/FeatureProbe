package com.featureprobe.api.base.model;

import com.featureprobe.api.base.enums.ResponseCodeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BaseResponse {

    private String code;

    private String message;

    public BaseResponse(ResponseCodeEnum responseCode) {
        this.message = responseCode.message();
    }

}