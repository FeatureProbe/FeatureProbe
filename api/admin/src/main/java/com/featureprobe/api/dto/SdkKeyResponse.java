package com.featureprobe.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class SdkKeyResponse {

    private Long version;

    @Schema(description = "client key to server key mappings")
    @JsonProperty("mapping")
    Map<String, String> clientKeyToServerKey;

    public void put(String clientSdkKey, String serverSdkKey) {
        if (clientKeyToServerKey == null) {
            clientKeyToServerKey = new HashMap<>();
        }

        clientKeyToServerKey.put(clientSdkKey, serverSdkKey);
    }
}
