package com.featureprobe.api.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

@Data
public class SegmentUpdateRequest {

    @NotBlank
    private String name;

    private String description;

}
