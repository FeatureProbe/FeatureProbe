package io.featureprobe.api.dto;

import lombok.Data;

@Data
public class TargetingDiffRequest {

    private Long currentVersion;

    private Long targetVersion;

}
