package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.MatcherTypeEnum;

public interface ServerEventEntity {

    Long getOrganizationId();

    String getProjectKey();

    String getServerSdkKey();

    String getClientSdkKey();

    MetricTypeEnum getType();

    String getName();

    MatcherTypeEnum getMatcher();

    String getUrl();

    String getSelector();

}
