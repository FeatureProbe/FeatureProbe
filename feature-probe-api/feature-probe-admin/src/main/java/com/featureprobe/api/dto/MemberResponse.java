package com.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.Date;

@Data
public class MemberResponse {

    @Schema(description = "The account of the member.")
    private String account;

    @Schema(description = "The role of the member.")
    private String role;

    @Schema(description = "The creation time of the member.")
    private Date createdTime;

    @Schema(description = "The creator of the member.")
    private String createdBy;

    @Schema(description = "The modification time of the member.")
    private Date modifiedTime;

    @Schema(description = "The editor of the member.")
    private String modifiedBy;

}
