package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class MemberCreateRequest {

    @NotNull
    private List<String> accounts;

    private String source;

    @NotNull
    private OrganizationRoleEnum role;

    @NotBlank
    private String password;

}
