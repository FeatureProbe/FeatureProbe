package io.featureprobe.api.auth;

import io.featureprobe.api.base.enums.MemberSourceEnum;
import io.featureprobe.api.base.enums.OperationType;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.OperationLog;
import io.featureprobe.api.dao.entity.OrganizationMember;
import io.featureprobe.api.service.GuestService;
import io.featureprobe.api.service.MemberService;
import io.featureprobe.api.service.OperationLogService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
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
public class GuestAuthenticationProvider implements AuthenticationProvider {

    private MemberService memberService;

    private GuestService guestService;

    private OperationLogService operationLogService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        GuestAuthenticationToken token = (GuestAuthenticationToken) authentication;
        Optional<Member> member = memberService.findByAccount(token.getAccount());
        OperationLog log = new OperationLog(OperationType.LOGIN.name() + "_" + token.getSource(),
                token.getAccount());
        if (member.isPresent()) {
            if (isAccessTokenMember(member)) {
                return null;
            }
            memberService.updateLoginTime(member.get(), getDefaultOrganizationMember(member.get()).getOrganizationId());
            operationLogService.save(log);
            return new UserPasswordAuthenticationToken(
                    AuthenticatedMember.create(member.get(), getDefaultOrganizationMember(member.get())),
                    Collections.emptyList());
        }

        Member newMember = guestService.initGuest(token.getAccount(), token.getSource());
        operationLogService.save(log);
        return new UserPasswordAuthenticationToken(
                AuthenticatedMember.create(newMember, getDefaultOrganizationMember(newMember)),
                Collections.emptyList());
    }

    private boolean isAccessTokenMember(Optional<Member> member) {
        return StringUtils.equalsIgnoreCase(member.get().getSource(), MemberSourceEnum.ACCESS_TOKEN.name());
    }

    private OrganizationMemberModel getDefaultOrganizationMember(Member member) {
        OrganizationMember organizationMember = member.getOrganizationMembers().get(0);
        return new OrganizationMemberModel(organizationMember.getOrganization().getId(),
                organizationMember.getOrganization().getName(), organizationMember.getRole());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return (GuestAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
