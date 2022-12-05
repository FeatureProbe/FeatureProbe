package com.featureprobe.api.dto;

import com.featureprobe.api.base.model.Variation;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;


@Data
public class ToggleCreateRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String key;

    private String desc;

    private List<String> tags;

    @NotNull
    private Boolean clientAvailability;

    @NotBlank
    private String returnType;

    @NotEmpty
    private List<Variation> variations;

    @NotNull
    private Integer disabledServe;

    private boolean permanent;
}
