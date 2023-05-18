package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class MemberUpdateRequest {

    @Schema(description = "A system-unique account used to reference the member.")
    @NotBlank
    private String account;

    @Schema(description = "Assign a new password for member to login.")
    private String password;

    @Schema(description = "The nickname to member.")
    private String nickname;

    @Schema(description = "Assign new built-in role to member.")
    private OrganizationRoleEnum role;

}
