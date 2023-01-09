package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.dto.ApprovalRecordQueryRequest;
import com.featureprobe.api.dto.ApprovalRecordResponse;
import com.featureprobe.api.dto.ApprovalTotalResponse;
import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import com.featureprobe.api.service.ApprovalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
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
@Tag(name = "Approval records", description = "The approval records API allows you to list and " +
        "total approval records programmatically.")
@RequestMapping("/api/approvalRecords")
@AllArgsConstructor
@RestController
public class ApprovalRecordController {

    private ApprovalRecordService approvalRecordService;

    @GetMapping
    @GetApiResponse
    @Operation(summary = "List approval records", description = "Use filter to fetch approval records list.")
    public Page<ApprovalRecordResponse> list(@Validated ApprovalRecordQueryRequest queryRequest) {
        return approvalRecordService.list(queryRequest);
    }

    @GetMapping("/total")
    @GetApiResponse
    @Operation(summary = "Total approval records", description = "Total approval records by status.")
    public ApprovalTotalResponse total(@Schema(description = "Built-in status for the approval record.")
                                           ApprovalStatusEnum status) {
        return new ApprovalTotalResponse(approvalRecordService.total(status));
    }

}
