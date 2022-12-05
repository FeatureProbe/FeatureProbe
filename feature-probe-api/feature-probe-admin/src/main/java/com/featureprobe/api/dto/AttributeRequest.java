package com.featureprobe.api.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class AttributeRequest {

    @NotBlank
    private String key;

}
