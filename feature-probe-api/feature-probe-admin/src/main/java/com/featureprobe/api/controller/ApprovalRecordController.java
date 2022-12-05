package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.dto.ApprovalRecordQueryRequest;
import com.featureprobe.api.dto.ApprovalRecordResponse;
import com.featureprobe.api.dto.ApprovalTotalResponse;
import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import com.featureprobe.api.service.ApprovalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@Slf4j
@DefaultApiResponses
@Tag(name = "Approval record", description = "Using the approval API, you can query approval record")
@RequestMapping("/api/approvalRecords")
@AllArgsConstructor
@RestController
public class ApprovalRecordController {

    private ApprovalRecordService approvalRecordService;

    @GetMapping
    @GetApiResponse
    @Operation(summary = "Get approval list", description = "Get approval list.")
    public Page<ApprovalRecordResponse> list(@Validated ApprovalRecordQueryRequest queryRequest) {
        return approvalRecordService.list(queryRequest);
    }

    @GetMapping("/total")
    @GetApiResponse
    @Operation(summary = "Get approval total by status", description = "Get approval list.")
    public ApprovalTotalResponse total(ApprovalStatusEnum status) {
        return new ApprovalTotalResponse(approvalRecordService.total(status));
    }

}
