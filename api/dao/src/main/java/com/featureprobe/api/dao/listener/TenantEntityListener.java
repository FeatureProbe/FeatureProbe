package com.featureprobe.api.dao.listener;

import com.featureprobe.api.base.tenant.TenantContext;
import com.featureprobe.api.dao.entity.TenantSupport;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

public class TenantEntityListener {

    @PrePersist
    public void prePersist(Object entity) {
        if (entity instanceof TenantSupport && TenantContext.getCurrentTenant() != null) {
            ((TenantSupport) entity).setOrganizationId(Long.parseLong(TenantContext.getCurrentTenant()));
        }
    }

    @PreUpdate
    public void preUpdate(Object entity) {
        if (entity instanceof TenantSupport && TenantContext.getCurrentTenant() != null) {
            ((TenantSupport) entity).setOrganizationId(Long.parseLong(TenantContext.getCurrentTenant()));
        }
    }

}
