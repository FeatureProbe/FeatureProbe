package com.featureprobe.api.dto;

import lombok.Data;
import java.util.Date;

@Data
public class MemberResponse {

    private String account;

    private String role;

    private Date createdTime;

    private String createdBy;

    private Date modifiedTime;

    private String modifiedBy;

}
