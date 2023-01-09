package com.featureprobe.api.auth;

import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public class TokenHelper {

    private static final String ACCOUNT_KEY = "account";
    private static final String USER_ID_KEY = "userId";
    private static final String ROLE_KEY = "role";

    public static final Long getUserId() {
        Authentication authentication = SecurityContextHolder.
                getContext().getAuthentication();
        if (authentication instanceof AccessTokenAuthenticationToken) {
            return ((AccessTokenAuthenticationToken)authentication).getPrincipal().getId();
        } else if (authentication instanceof  JwtAuthenticationToken) {
            return (Long)((JwtAuthenticationToken)authentication).getTokenAttributes().get(USER_ID_KEY);
        } else {
            return null;
        }
    }

    public static final String getAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AccessTokenAuthenticationToken) {
            return ((AccessTokenAuthenticationToken)authentication).getPrincipal().getName();
        } else if (authentication instanceof  JwtAuthenticationToken) {
            return (String) ((JwtAuthenticationToken)authentication).getTokenAttributes().get(ACCOUNT_KEY);
        } else {
            return null;
        }
    }

    public static final String getRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof AccessTokenAuthenticationToken) {
            return ((AccessTokenAuthenticationToken)authentication).getPrincipal().getRole();
        } else if (authentication instanceof  JwtAuthenticationToken) {
            return (String) ((JwtAuthenticationToken)authentication).getTokenAttributes().get(ROLE_KEY);
        } else {
            return null;
        }
    }

    public static final boolean isOwner() {
        return OrganizationRoleEnum.OWNER.name().equals(getRole());
    }
}
