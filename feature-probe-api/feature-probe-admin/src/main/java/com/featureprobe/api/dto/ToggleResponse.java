package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.Variation;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
public class ToggleResponse {

    private String name;

    private String key;

    private Boolean permanent;

    private Long useDays;

    private String returnType;

    private Integer disabledServe;

    private Boolean archived;

    private String desc;

    private List<Variation> variations;

    private Boolean clientAvailability;

    private Set<String> tags;

    private Date createdTime;

    private Date modifiedTime;

    private String modifiedBy;

}
