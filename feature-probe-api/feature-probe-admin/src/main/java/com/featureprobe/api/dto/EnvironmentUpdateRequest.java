package com.featureprobe.api.dto;

import lombok.Data;

@Data
public class EnvironmentUpdateRequest {

    private String name;

    private boolean resetServerSdk;

    private boolean resetClientSdk;

}
