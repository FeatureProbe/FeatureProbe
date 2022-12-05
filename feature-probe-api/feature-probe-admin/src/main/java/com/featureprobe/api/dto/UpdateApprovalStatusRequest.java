package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import lombok.Data;

@Data
public class UpdateApprovalStatusRequest {

    private ApprovalStatusEnum status;

    private String comment;

}
