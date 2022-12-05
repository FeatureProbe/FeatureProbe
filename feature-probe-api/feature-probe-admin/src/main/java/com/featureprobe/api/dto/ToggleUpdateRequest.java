package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.Variation;
import lombok.Data;

import java.util.List;


@Data
public class ToggleUpdateRequest {

    private String name;

    private String desc;

    private List<String> tags;

    private Boolean clientAvailability;

    private List<Variation> variations;

    private Integer disabledServe;

    private boolean permanent;
}
