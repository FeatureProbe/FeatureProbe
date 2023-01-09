package com.featureprobe.api.base.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class PaginationRequest {

    @Schema(description = "Current page number .", minimum = "0")
    private Integer pageIndex = 0;

    @Schema(description = "Maximum number of entries per page .", minimum = "1")
    private Integer pageSize = 10;

}
