package io.featureprobe.api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class SecretKeyResponse {

    @Schema(description = "A system-suggested secret key.")
    private String secretKey;
}
