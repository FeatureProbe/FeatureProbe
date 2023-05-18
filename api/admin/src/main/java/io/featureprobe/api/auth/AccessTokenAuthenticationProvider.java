package io.featureprobe.api.auth;

import io.featureprobe.api.base.enums.OperationType;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.dao.entity.AccessToken;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.OperationLog;
import io.featureprobe.api.dao.entity.OrganizationMember;
import io.featureprobe.api.service.AccessTokenService;
import io.featureprobe.api.service.MemberService;
import io.featureprobe.api.service.OperationLogService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
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
        OperationLog log = new OperationLog(OperationType.LOGIN.name() + "_" + "AccessToken", token.getName());
        if (member.isPresent()) {
            TenantContext.setCurrentTenant(token.getOrganizationId().toString());
            memberService.updateVisitedTime(member.get().getAccount());
            accessTokenService.updateVisitedTime(token.getId());
            operationLogService.save(log);
            return new AccessTokenAuthenticationToken(
                    AuthenticatedMember.create(member.get(), null),
                    String.valueOf(token.getOrganizationId()),
                    Collections.emptyList());
        }
        return null;
    }

    private OrganizationMemberModel getDefaultOrganizationMember(Member member) {
        OrganizationMember organizationMember = member.getOrganizationMembers().get(0);
        return new OrganizationMemberModel(organizationMember.getOrganization().getId(),
                organizationMember.getOrganization().getName(), organizationMember.getRole());
    }


    @Override
    public boolean supports(Class<?> authentication) {
        return (AccessTokenAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
