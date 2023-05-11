package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.AccessTokenType;
import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class AccessTokenCreateRequest {

    @Schema(description = "A human-friendly name for the access token.")
    @NotNull
    private String name;

    @Schema(description = "Built-in role for the token.")
    private OrganizationRoleEnum role;

    @Schema(description = "Built-in type for the token.")
    @NotNull
    private AccessTokenType type;

}
