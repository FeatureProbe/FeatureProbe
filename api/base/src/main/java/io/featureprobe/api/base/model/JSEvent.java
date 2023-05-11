package io.featureprobe.api.base.model;

import io.featureprobe.api.base.enums.EventTypeEnum;
import io.featureprobe.api.base.enums.MatcherTypeEnum;
import lombok.Data;

@Data
public class JSEvent {

    private EventTypeEnum type;

    private String name;

    private MatcherTypeEnum matcher;

    private String url;

    private String selector;

}
