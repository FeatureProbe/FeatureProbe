package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import lombok.Data;
import java.util.Date;

@Data
public class ApprovalResponse {

    private String title;

    private String projectKey;

    private String environmentKey;

    private String toggleKey;

    private ApprovalStatusEnum status;

    private String viewers;

    private String comment;

    private String approvalBy;

    private String submitBy;

    private Date approvalDate;

    private Object currentData;

    private Object approvalData;

}
