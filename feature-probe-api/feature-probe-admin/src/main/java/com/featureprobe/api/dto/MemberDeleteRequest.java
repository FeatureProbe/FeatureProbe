package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class MemberDeleteRequest {

    @Schema(description = "A system-unique account used to reference the member.")
    @NotBlank
    private String account;

}
