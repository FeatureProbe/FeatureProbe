package io.featureprobe.api.base.model;

import io.featureprobe.api.base.enums.ResponseCodeEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BaseResponse {

    @Schema(description = "Specific error code encountered")
    private String code;

    @Schema(description = "Description of the error")
    private String message;

    public BaseResponse(ResponseCodeEnum responseCode) {
        this.message = responseCode.message();
    }

}