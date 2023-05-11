package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.ApprovalStatusEnum;
import io.featureprobe.api.base.enums.ApprovalTypeEnum;
import io.featureprobe.api.base.model.PaginationRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class ApprovalRecordQueryRequest extends PaginationRequest {

    @Schema(description = "Fuzzy matching according to toggle name and approval record changes description.")
    private String keyword;

    @Schema(description = "Exact match according to status for the approval record.")
    private List<ApprovalStatusEnum> status;

    @NotNull
    @Schema(description = "Exact match according to built-in types for the approval record. " +
            "<br/> **[APPROVAL]: Current user approval required.**" +
            "<br/> **[APPLY]: Approval submitted by current user.**")
    private ApprovalTypeEnum type;

}
