package io.featureprobe.api.auth;

import io.featureprobe.api.base.component.SpringBeanManager;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UserPasswordAuthenticationProvider implements AuthenticationProvider {

    @Value("${app.security.validator.impl:common}")
    private String validatorName;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        AccountValidator validator = SpringBeanManager.getBeanByName(validatorName);
        return validator.authenticate(authentication);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (UserPasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
