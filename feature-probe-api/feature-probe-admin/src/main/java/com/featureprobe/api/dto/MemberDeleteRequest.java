package com.featureprobe.api.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class MemberDeleteRequest {

    @NotBlank
    private String account;

}
