package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.AccessTokenType;
import io.featureprobe.api.base.model.PaginationRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class AccessTokenSearchRequest extends PaginationRequest {

    @NotNull
    @Schema(description = "The type of access token to retrieve .")
    private AccessTokenType type;


}
