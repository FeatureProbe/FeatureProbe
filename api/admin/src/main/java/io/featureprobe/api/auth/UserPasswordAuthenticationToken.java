package io.featureprobe.api.auth;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class UserPasswordAuthenticationToken extends AbstractAuthenticationToken {

    private final String account;

    private String source;

    private String password;

    private String organizationId;

    private boolean initializeOrganization;

    private AuthenticatedMember principal;

    public UserPasswordAuthenticationToken(String account, String source, String password,
                                           String organizationId, Boolean initializeOrganization) {
        super(null);
        this.account = account;
        this.source = source;
        this.password = password;
        this.organizationId = organizationId;
        this.initializeOrganization = initializeOrganization;
        super.setAuthenticated(false);
    }

    public UserPasswordAuthenticationToken(AuthenticatedMember principal,
                                           Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.account = principal.getName();
        super.setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public AuthenticatedMember getPrincipal() {
        return principal;
    }

    public String getAccount() {
        return account;
    }

    public String getSource() {
        return source;
    }

    public String getPassword() {
        return password;
    }

    public String getOrganizationId() {
        return organizationId;
    }

    public boolean isInitializeOrganization() {
        return initializeOrganization;
    }
}
