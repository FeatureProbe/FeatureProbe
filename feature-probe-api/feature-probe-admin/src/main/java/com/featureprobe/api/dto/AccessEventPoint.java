package com.featureprobe.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AccessEventPoint {

    String name;
    List<VariationAccessCounter> values;
    Long lastChangeVersion;
    Integer sorted;
}
