package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.SegmentRuleModel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.List;

@Data
public class SegmentPublishRequest {

    private List<SegmentRuleModel> rules;

    @Schema(description = "Release notes")
    private String comment;

}
