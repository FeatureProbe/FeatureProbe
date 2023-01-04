package com.featureprobe.api.auth;

import com.featureprobe.api.base.enums.MemberSourceEnum;
import com.featureprobe.api.base.enums.OperationType;
import com.featureprobe.api.dao.entity.Member;
import com.featureprobe.api.dao.entity.OperationLog;
import com.featureprobe.api.service.GuestService;
import com.featureprobe.api.service.MemberService;
import com.featureprobe.api.service.OperationLogService;
import lombok.AllArgsConstructor;
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
            if (isAccessTokenMumber(member)) {
                return null;
            }
            memberService.updateVisitedTime(token.getAccount());
            operationLogService.save(log);
            return new UserPasswordAuthenticationToken(AuthenticatedMember.create(member.get()),
                    Arrays.asList());
        }

        Member newMember = guestService.initGuest(token.getAccount(), token.getSource());
        operationLogService.save(log);
        return new UserPasswordAuthenticationToken(AuthenticatedMember.create(newMember),
                Arrays.asList());
    }

    private boolean isAccessTokenMumber(Optional<Member> member) {
        return StringUtils.equalsIgnoreCase(member.get().getSource(), MemberSourceEnum.ACCESS_TOKEN.name());
    }


    @Override
    public boolean supports(Class<?> authentication) {
        return (GuestAuthenticationToken.class.isAssignableFrom(authentication));
    }

}
