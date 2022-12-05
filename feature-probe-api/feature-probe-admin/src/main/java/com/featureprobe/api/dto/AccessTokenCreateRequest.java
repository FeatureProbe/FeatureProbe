package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.AccessTokenType;
import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class AccessTokenCreateRequest {

    @NotNull
    private String name;

    private OrganizationRoleEnum role;

    @NotNull
    private AccessTokenType type;

}
