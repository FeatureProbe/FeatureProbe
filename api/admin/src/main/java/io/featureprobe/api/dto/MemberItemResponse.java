package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberItemResponse {

    @Schema(description = "The account of the member.")
    private String account;

    @Schema(description = "The nickname of the member.")
    private String nickname;

    @Schema(description = "The role of the member.")
    private String role;

    @Schema(description = "Whether to allow editing other members.")
    private boolean allowEdit;

    @Schema(description = "The creator of the member.")
    private String createdBy;

    @Schema(description = "The last visit time of the member.")
    private Date visitedTime;

    private String organizationName;

    private Long organizationId;

    public MemberItemResponse(String account, String role) {
        this.account = account;
        this.role = role;
    }

}
