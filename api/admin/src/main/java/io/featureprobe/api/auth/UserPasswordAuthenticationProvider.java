package io.featureprobe.api.auth;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@AllArgsConstructor
public class UserPasswordAuthenticationProvider implements AuthenticationProvider {

    List<AccountValidator> validators;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        for (AccountValidator validator : validators) {
            Authentication result = validator.authenticate(authentication);
            if (result != null) {
                return result;
            }
        }
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (UserPasswordAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
