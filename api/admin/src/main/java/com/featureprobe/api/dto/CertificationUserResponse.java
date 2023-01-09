package com.featureprobe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CertificationUserResponse {

    private String account;

    private String role;

    private Long organizeId;

    private String token;
}
