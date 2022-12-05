package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

@Data
public class SegmentSearchRequest extends PaginationRequest {

    private String keyword;

    private Boolean includeDeleted = false;
}
