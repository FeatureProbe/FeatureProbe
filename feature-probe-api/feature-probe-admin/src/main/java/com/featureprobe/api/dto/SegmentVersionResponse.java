package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.SegmentRuleModel;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class SegmentVersionResponse {

    private String projectKey;

    private String key;

    private String comment;

    private List<SegmentRuleModel> rules;

    private Long version;

    private Date createdTime;

    private String createdBy;


}
