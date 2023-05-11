package io.featureprobe.api.auth;

import org.springframework.security.core.Authentication;

public interface AccountValidator {

    Authentication authenticate(Authentication authentication);

}
