package io.featureprobe.api.dao.listener;

import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.dao.entity.TenantSupport;
import org.springframework.stereotype.Component;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

@Component
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
