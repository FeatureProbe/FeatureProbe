package io.featureprobe.api.auth;

import com.google.common.collect.Lists;
import io.featureprobe.api.base.enums.MemberSourceEnum;
import io.featureprobe.api.base.enums.MemberStatusEnum;
import io.featureprobe.api.base.enums.OperationType;
import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.OperationLog;
import io.featureprobe.api.dto.MemberCreateRequest;
import io.featureprobe.api.service.MemberService;
import io.featureprobe.api.service.OperationLogService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

import static org.springframework.ldap.query.LdapQueryBuilder.query;


@Component(value = "ldap")
@AllArgsConstructor
@Qualifier("ldap")
@Slf4j
@Primary
public class LDAPAccountValidator implements AccountValidator{

    private MemberService memberService;

    private OperationLogService operationLogService;

    private LdapTemplate ldapTemplate;

    @Override
    public Authentication authenticate(Authentication authentication) {
        UserPasswordAuthenticationToken token = (UserPasswordAuthenticationToken) authentication;
        try {
            ldapTemplate.authenticate(query().where("uid").is(token.getAccount()),token.getPassword());
        }catch (RuntimeException e) {
            return null;
        }

        String memberName = "ldap_"+token.getAccount();
        Optional<Member> members =  memberService.findByAccount(memberName);
        if (!members.isPresent()) {
            MemberCreateRequest memberCreateRequest = new MemberCreateRequest();
            memberCreateRequest.setAccounts(Lists.newArrayList(memberName));
            memberCreateRequest.setPassword(token.getPassword());
            memberCreateRequest.setSource(MemberSourceEnum.PLATFORM.name());
            memberCreateRequest.setRole(OrganizationRoleEnum.WRITER);
            TenantContext.setCurrentTenant("1");
            TenantContext.setCurrentOrganization(
                    new OrganizationMemberModel(1L,"Default Organize",OrganizationRoleEnum.WRITER)
            );
            memberService.createFlush(memberCreateRequest);
        }
        Optional<Member> member = memberService.findByAccountFlush(memberName);
        OperationLog log = new OperationLog(OperationType.LOGIN.name() + "_" + token.getSource(),
                memberName);
        if (!member.isPresent() || isAccessTokenNumber(member)) {
            return null;
        }
        boolean passwordMatched = new BCryptPasswordEncoder().matches(token.getPassword(),
                member.get().getPassword());
        if (passwordMatched && MemberStatusEnum.ACTIVE.name().equals(member.get().getStatus().name())) {
            memberService.updateVisitedTime(memberName);
            operationLogService.save(log);
            return new UserPasswordAuthenticationToken(AuthenticatedMember.create(member.get()),
                    Collections.emptyList());
        }
        return null;

    }

    private boolean isAccessTokenNumber(Optional<Member> member) {
        return StringUtils.equalsIgnoreCase(member.get().getSource(), MemberSourceEnum.ACCESS_TOKEN.name());
    }
}
