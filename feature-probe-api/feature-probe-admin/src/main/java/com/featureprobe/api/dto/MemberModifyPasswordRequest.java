package com.featureprobe.api.dto;

import lombok.Data;

@Data
public class MemberModifyPasswordRequest {

    private String newPassword;

    private String oldPassword;

}
