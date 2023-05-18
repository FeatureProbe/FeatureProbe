package io.featureprobe.api.auth;

import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.Organization;
import lombok.Data;
import org.springframework.security.core.AuthenticatedPrincipal;

import java.util.Currency;
import java.util.List;

@Data
public class AuthenticatedMember implements AuthenticatedPrincipal {

    private Long id;

    private String name;
    private String role;
    private OrganizationMemberModel organizationMemberModel;

    private List<Organization> organizations;

    public static AuthenticatedMember create(Member member, OrganizationMemberModel organizationMemberModel) {
        AuthenticatedMember authenticatedMember = new AuthenticatedMember();
        authenticatedMember.setId(member.getId());
        authenticatedMember.setName(member.getAccount());
        authenticatedMember.setOrganizations(member.getOrganizations());
        authenticatedMember.setOrganizationMemberModel(organizationMemberModel);
        return authenticatedMember;
    }
}
