package io.featureprobe.api.auth;

import org.springframework.security.core.AuthenticationException;

public class OrganizationEmptyException extends AuthenticationException {

    public OrganizationEmptyException(String msg) {
        super(msg);
    }

    public OrganizationEmptyException(String msg, Throwable cause) {
        super(msg, cause);
    }
}
