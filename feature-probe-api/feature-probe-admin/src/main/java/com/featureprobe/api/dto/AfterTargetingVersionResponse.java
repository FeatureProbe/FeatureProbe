package com.featureprobe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AfterTargetingVersionResponse {

    private Long total;

    private List<TargetingVersionResponse> versions;
}
