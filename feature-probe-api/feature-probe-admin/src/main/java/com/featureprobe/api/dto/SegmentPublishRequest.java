package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.SegmentRuleModel;
import lombok.Data;

import java.util.List;

@Data
public class SegmentPublishRequest {

    private List<SegmentRuleModel> rules;

    private String comment;

}
