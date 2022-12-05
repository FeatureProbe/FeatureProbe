package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import com.featureprobe.api.base.enums.VisitFilter;
import com.featureprobe.api.base.model.PaginationRequest;
import lombok.Data;

import java.util.List;

@Data
public class ToggleSearchRequest extends PaginationRequest {

    private String environmentKey;

    private VisitFilter visitFilter;

    private Boolean disabled;

    private List<String> tags;

    private String keyword;

    private boolean archived;

    private List<ToggleReleaseStatusEnum> releaseStatusList;

    private Boolean permanent;

}
