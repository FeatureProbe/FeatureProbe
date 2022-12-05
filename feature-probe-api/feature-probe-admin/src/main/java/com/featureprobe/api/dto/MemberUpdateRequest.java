package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class MemberUpdateRequest {

    @NotBlank
    private String account;

    @NotBlank
    private String password;

    @NotNull
    private OrganizationRoleEnum role;


}
