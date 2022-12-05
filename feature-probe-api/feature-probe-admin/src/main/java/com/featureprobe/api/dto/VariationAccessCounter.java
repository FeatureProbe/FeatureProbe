package com.featureprobe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VariationAccessCounter {

    @NotBlank
    private String value;

    @NotNull
    private Long count;

    @NotNull
    private Long version;

    @NotNull
    private Integer index;

    private Boolean deleted;

    public VariationAccessCounter(String value, Long count) {
        this.value = value;
        this.count = count;
    }


}
