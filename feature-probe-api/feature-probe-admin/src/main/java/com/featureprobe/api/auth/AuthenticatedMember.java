package com.featureprobe.api.auth;

import com.featureprobe.api.dao.entity.Member;
import com.featureprobe.api.dao.entity.Organization;
import lombok.Data;
import org.springframework.security.core.AuthenticatedPrincipal;

import java.util.List;

@Data
public class AuthenticatedMember implements AuthenticatedPrincipal {

    private Long id;

    private String name;
    private String role;

    private List<Organization> organizations;

    public static AuthenticatedMember create(Member member) {
        AuthenticatedMember authenticatedMember = new AuthenticatedMember();
        authenticatedMember.setId(member.getId());
        authenticatedMember.setName(member.getAccount());
        authenticatedMember.setOrganizations(member.getOrganizations());
        return authenticatedMember;
    }
}
