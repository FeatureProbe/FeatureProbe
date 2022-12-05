package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.AccessTokenType;
import com.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class AccessTokenSearchRequest extends PaginationRequest {

    @NotNull
    private AccessTokenType type;


}
