package io.featureprobe.api.dto;

import io.featureprobe.api.base.model.SegmentRuleModel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class SegmentResponse {

    @Schema(description = "The name of the segment.")
    private String name;

    @Schema(description = "The key of the key.")
    private String key;

    @Schema(description = "Serve a variation to specific users based on their attributes.")
    private List<SegmentRuleModel> rules;

    @Schema(description = "The description of the segment.")
    private String description;

    @Schema(description = "The key of the project.")
    private String projectKey;

    @Schema(description = "The creation time of the project.")
    private Date createdTime;

    @Schema(description = "The modification time of the project.")
    private Date modifiedTime;

    @Schema(description = "The editor of the project.")
    private String modifiedBy;

    @Schema(description = "The latest version.")
    private Long version;
}
