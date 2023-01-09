package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.PaginationRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class MemberSearchRequest extends PaginationRequest {

    @Schema(description = "Fuzzy matching according to member account.")
    private String keyword;

}
