package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class UpdateApprovalStatusRequest extends ToggleControlConfRequest{

    @Schema(description = "Built-in status assigned to approval form.")
    private ApprovalStatusEnum status;


    @Schema(description = "A custom description.")
    private String comment;

}
