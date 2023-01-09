package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;

@Data
public class AccessTokenResponse {

    @Schema(description = "The ID of the access token.")
    private Long id;

    @Schema(description = "The name of the access token.")
    private String name;

    @Schema(description = "The built-in role for the access token.")
    private OrganizationRoleEnum role;

    @Schema(description = "The creator of the access token.")
    private String createdBy;

    @Schema(description = "The last visit time of the access token.")
    private Date visitedTime;

}
