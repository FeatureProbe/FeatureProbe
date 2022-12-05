package com.featureprobe.api.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProjectResponse {

    private String name;

    private String key;

    private String description;

    private List<EnvironmentResponse> environments;

}
