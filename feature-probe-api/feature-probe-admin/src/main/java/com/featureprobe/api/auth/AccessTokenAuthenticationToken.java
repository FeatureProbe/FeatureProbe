package com.featureprobe.api.auth;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class AccessTokenAuthenticationToken extends AbstractAuthenticationToken {
    private String token;

    private String account;

    private AuthenticatedMember principal;

    private String tenant;

    public AccessTokenAuthenticationToken(String token) {
        super(null);
        this.token = token;
        super.setAuthenticated(false);
    }

    public AccessTokenAuthenticationToken(AuthenticatedMember principal,
                                          String tenant,
                                          Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.principal = principal;
        this.tenant = tenant;
        this.account = principal.getName();
        super.setAuthenticated(true);
    }

    public String getToken() {
        return token;
    }

    public String getTenant() {
        return tenant;
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

}
