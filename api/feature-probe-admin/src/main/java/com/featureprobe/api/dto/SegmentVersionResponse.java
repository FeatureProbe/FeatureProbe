package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.SegmentRuleModel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
public class SegmentVersionResponse {

    @Schema(description = "The key of the project.")
    private String projectKey;

    @Schema(description = "The key of the segment.")
    private String key;

    @Schema(description = "The release note of the segment version.")
    private String comment;

    @Schema(description = "Serve a variation to specific users based on their attributes.")
    private List<SegmentRuleModel> rules;

    @Schema(description = "The version number of the segment version.")
    private Long version;

    @Schema(description = "The publish time of the segment version.")
    private Date createdTime;

    @Schema(description = "The publisher of the segment version.")
    private String createdBy;


}
