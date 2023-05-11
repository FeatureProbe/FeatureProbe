package io.featureprobe.api.dao.entity;

import io.featureprobe.api.base.enums.EventTypeEnum;
import io.featureprobe.api.base.enums.MatcherTypeEnum;

public interface ServerEventEntity {

    Long getOrganizationId();

    String getProjectKey();

    String getServerSdkKey();

    String getClientSdkKey();

    EventTypeEnum getType();

    String getName();

    MatcherTypeEnum getMatcher();

    String getUrl();

    String getSelector();

}
