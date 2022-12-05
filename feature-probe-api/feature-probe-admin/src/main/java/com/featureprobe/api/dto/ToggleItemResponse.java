package com.featureprobe.api.dto;

import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import lombok.Data;

import java.util.Date;
import java.util.Set;

@Data
public class ToggleItemResponse {

    private String name;

    private String key;

    private Boolean permanent;

    private Long useDays;

    private String returnType;

    private String desc;

    private Set<String> tags;

    private Boolean disabled;

    private Date visitedTime;

    private Date modifiedTime;

    private String modifiedBy;

    private boolean locked;

    private String lockedBy;

    private Date lockedTime;

    private ToggleReleaseStatusEnum releaseStatus;
}
