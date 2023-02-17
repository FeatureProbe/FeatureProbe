package com.featureprobe.api.dao.entity;

import javax.persistence.Column;
import java.util.Date;

public interface ServerToggleEntity {

    Long getOrganizationId();

    String getProjectKey();

    String getEnvKey();

    String getServerSdkKey();

    String getClientSdkKey();

    Long getEnvVersion();

    String getToggleKey();

    Date getPublishTime();

    String getReturnType();
    @Column(columnDefinition = "TINYINT")
    Boolean getClientAvailability();

    Long getTargetingVersion();
    @Column(columnDefinition = "TINYINT")
    Boolean getTargetingDisabled();

    String getTargetingContent();

    @Column(columnDefinition = "TINYINT")
    Boolean getTrackAccessEvents();

}
