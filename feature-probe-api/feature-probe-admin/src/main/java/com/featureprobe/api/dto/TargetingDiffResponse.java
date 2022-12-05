package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.TargetingContent;
import lombok.Data;

@Data
public class TargetingDiffResponse {

    private Boolean currentDisabled;
    private TargetingContent currentContent;

    private Boolean oldDisabled;
    private TargetingContent oldContent;

}
