package com.featureprobe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectCreateRequest {


    @NotBlank
    private String name;

    @NotBlank
    private String key;

    private String description;

}
