package com.featureprobe.api.base.model;

import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.MatcherTypeEnum;
import lombok.Data;

@Data
public class JSEvent {

    private MetricTypeEnum type;

    private String name;

    private MatcherTypeEnum matcher;

    private String url;

    private String selector;

}
