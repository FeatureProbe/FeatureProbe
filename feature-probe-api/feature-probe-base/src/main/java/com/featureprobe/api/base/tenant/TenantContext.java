package com.featureprobe.api.base.tenant;

import com.featureprobe.api.base.model.OrganizationMemberModel;

public class TenantContext {

    private static ThreadLocal<String> currentTenant = new ThreadLocal<>();

    private static ThreadLocal<OrganizationMemberModel> currentOrganization = new ThreadLocal<>();

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

    public static OrganizationMemberModel getCurrentOrganization() {
        return currentOrganization.get();
    }

    public static void setCurrentTenant(String tenant) {
        currentTenant.set(tenant);
    }

    public static void setCurrentOrganization(OrganizationMemberModel organizationMemberModel) {
        currentOrganization.set(organizationMemberModel);
    }

    public static void clear() {
        currentTenant.remove();
        currentOrganization.remove();
    }

}
