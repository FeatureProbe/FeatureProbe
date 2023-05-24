package io.featureprobe.api.base.model;

import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrganizationMemberModel {

    private Long organizationId;

    private String organizationName;

    private OrganizationRoleEnum role;

    private Boolean valid;

    public OrganizationMemberModel(Long organizationId, String organizationName, OrganizationRoleEnum role){
        this.organizationId = organizationId;
        this.organizationName = organizationName;
        this.role = role;
        this.valid = true;
    }

    public String getRoleName() {
        return role.name();
    }
}
