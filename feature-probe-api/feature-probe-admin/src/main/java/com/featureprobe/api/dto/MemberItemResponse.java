package com.featureprobe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberItemResponse {

    private String account;

    private String role;

    private boolean allowEdit;

    private String createdBy;

    private Date visitedTime;

    public MemberItemResponse(String account, String role) {
        this.account = account;
        this.role = role;
    }

}
