package com.featureprobe.api.dto;

import lombok.Data;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

@Data
public class AccessSummary {

    @NotNull
    private Long startTime;

    @NotNull
    private Long endTime;

    @NotEmpty
    private Map<String, List<VariationAccessCounter>> counters;
}
