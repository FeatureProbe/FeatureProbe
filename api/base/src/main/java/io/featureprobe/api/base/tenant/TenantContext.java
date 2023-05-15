package io.featureprobe.api.base.tenant;

import io.featureprobe.api.base.model.OrganizationMemberModel;

public class TenantContext {

    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();

    private static final ThreadLocal<OrganizationMemberModel> currentOrganization = new ThreadLocal<>();

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
