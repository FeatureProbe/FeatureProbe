package com.featureprobe.api.config;

import com.featureprobe.api.auth.AccessTokenAuthenticationToken;
import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.dao.entity.Member;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Optional;

@Configuration
public class AuditingConfig implements AuditorAware {

    @Override
    public Optional<Member> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken)
                && !(authentication instanceof AccessTokenAuthenticationToken)) {
            return Optional.of(new Member(1L, ""));
        }
        return Optional.of(new Member(TokenHelper.getUserId(), TokenHelper.getAccount()));
    }

}
