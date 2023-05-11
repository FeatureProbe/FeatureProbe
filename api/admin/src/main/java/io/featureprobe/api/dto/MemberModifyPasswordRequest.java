package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class MemberModifyPasswordRequest {

    @Schema(description = "Assign a new password to a member.")
    @NotBlank
    private String newPassword;

    @Schema(description = "The member current password.")
    @NotBlank
    private String oldPassword;

}
