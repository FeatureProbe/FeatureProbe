package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.PaginationRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class SegmentSearchRequest extends PaginationRequest {

    @Schema(description = "Fuzzy matching according to segment name, key and description.")
    private String keyword;

}
