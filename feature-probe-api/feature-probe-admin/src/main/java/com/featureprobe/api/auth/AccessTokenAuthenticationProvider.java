package com.featureprobe.api.auth;

import com.featureprobe.api.base.enums.OperationType;
import com.featureprobe.api.base.tenant.TenantContext;
import com.featureprobe.api.dao.entity.AccessToken;
import com.featureprobe.api.dao.entity.Member;
import com.featureprobe.api.dao.entity.OperationLog;
import com.featureprobe.api.service.AccessTokenService;
import com.featureprobe.api.service.MemberService;
import com.featureprobe.api.service.OperationLogService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Optional;

@Component
@AllArgsConstructor
@Slf4j
public class AccessTokenAuthenticationProvider implements AuthenticationProvider {

    private MemberService memberService;

    private AccessTokenService accessTokenService;

    private OperationLogService operationLogService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        AccessTokenAuthenticationToken tokenAuth = (AccessTokenAuthenticationToken) authentication;
        Optional<AccessToken> accessToken = accessTokenService.findByToken(tokenAuth.getToken());
        if (!accessToken.isPresent()) {
            log.warn("API Access token not exists, token: {}", tokenAuth.getToken());
            return null;
        }
        AccessToken token = accessToken.get();
        Optional<Member> member = memberService.findById(token.getMemberId());
        if (!member.isPresent()) {
            log.warn("API Access token member not exists, userid: {}", token.getMemberId());
            return null;
        }
        OperationLog log = new OperationLog(OperationType.LOGIN.name(), token.getName());
        if (member.isPresent()) {
            TenantContext.setCurrentTenant(token.getOrganizationId().toString());
            memberService.updateVisitedTime(member.get().getAccount());
            accessTokenService.updateVisitedTime(token.getId());
            operationLogService.save(log);
            return new AccessTokenAuthenticationToken(AuthenticatedMember.create(member.get()),
                    String.valueOf(token.getOrganizationId()),
                    Arrays.asList());
        }
        return null;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (AccessTokenAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
