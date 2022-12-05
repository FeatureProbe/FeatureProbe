package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.TargetingContent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TargetingPublishRequest {

    private TargetingContent content;

    private String comment;

    private Boolean disabled;

}