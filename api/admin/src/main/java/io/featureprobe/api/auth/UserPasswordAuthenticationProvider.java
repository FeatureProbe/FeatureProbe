package io.featureprobe.api.auth;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@AllArgsConstructor
public class UserPasswordAuthenticationProvider implements AuthenticationProvider {

    @Qualifier("${app.security.validator.impl}")
    AccountValidator validator;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        return validator.authenticate(authentication);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (UserPasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
