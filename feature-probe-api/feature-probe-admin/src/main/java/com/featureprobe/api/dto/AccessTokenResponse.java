package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import lombok.Data;

import java.util.Date;

@Data
public class AccessTokenResponse {

    private Long id;

    private String name;

    private OrganizationRoleEnum role;

    private String createdBy;

    private Date visitedTime;
}
