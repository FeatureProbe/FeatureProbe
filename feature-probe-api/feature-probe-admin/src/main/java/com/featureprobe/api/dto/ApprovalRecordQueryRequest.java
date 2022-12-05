package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import com.featureprobe.api.base.enums.ApprovalTypeEnum;
import com.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ApprovalRecordQueryRequest extends PaginationRequest {

    private String keyword;

    private List<ApprovalStatusEnum> status;

    @NotNull
    private ApprovalTypeEnum type;

}
