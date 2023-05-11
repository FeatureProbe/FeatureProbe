package io.featureprobe.api.auth;

import io.featureprobe.api.base.enums.MemberSourceEnum;
import io.featureprobe.api.base.enums.MemberStatusEnum;
import io.featureprobe.api.base.enums.OperationType;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.OperationLog;
import io.featureprobe.api.service.MemberService;
import io.featureprobe.api.service.OperationLogService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
@AllArgsConstructor
@Qualifier("common")
public class CommonAccountValidator implements AccountValidator {

    private MemberService memberService;

    private OperationLogService operationLogService;

    @Override
    public Authentication authenticate(Authentication authentication) {
        UserPasswordAuthenticationToken token = (UserPasswordAuthenticationToken) authentication;
        if (StringUtils.isNotBlank(token.getAccount()) && StringUtils.isNotBlank(token.getPassword())) {
            Optional<Member> member = memberService.findByAccount(token.getAccount());
            OperationLog log = new OperationLog(OperationType.LOGIN.name() + "_" + token.getSource(),
                    token.getAccount());
            if (!member.isPresent() || isAccessTokenNumber(member)) {
                return null;
            }
            boolean passwordMatched = new BCryptPasswordEncoder().matches(token.getPassword(),
                    member.get().getPassword());
            if (passwordMatched && MemberStatusEnum.ACTIVE.name().equals(member.get().getStatus().name())) {
                memberService.updateVisitedTime(token.getAccount());
                operationLogService.save(log);
                return new UserPasswordAuthenticationToken(AuthenticatedMember.create(member.get()), Arrays.asList());
            }
        }
        return null;
    }

    private boolean isAccessTokenNumber(Optional<Member> member) {
        return StringUtils.equalsIgnoreCase(member.get().getSource(), MemberSourceEnum.ACCESS_TOKEN.name());
    }
}
