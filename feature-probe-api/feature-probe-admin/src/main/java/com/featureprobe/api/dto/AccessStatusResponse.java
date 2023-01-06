package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AccessStatusResponse {

    @Schema(description = "Whether the toggle is access successfully.")
    private Boolean isAccess;

}
