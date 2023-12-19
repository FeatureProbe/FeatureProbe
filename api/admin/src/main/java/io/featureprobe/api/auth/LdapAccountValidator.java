package io.featureprobe.api.auth;

import io.featureprobe.api.base.enums.MemberSourceEnum;
import io.featureprobe.api.base.enums.MemberStatusEnum;
import io.featureprobe.api.base.enums.OperationType;
import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.OperationLog;
import io.featureprobe.api.dao.entity.Organization;
import io.featureprobe.api.dao.entity.OrganizationMember;
import io.featureprobe.api.dao.repository.OrganizationRepository;
import io.featureprobe.api.dto.MemberCreateRequest;
import io.featureprobe.api.service.MemberService;
import io.featureprobe.api.service.OperationLogService;
import io.featureprobe.api.service.OrganizationService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Primary;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

import static org.springframework.ldap.query.LdapQueryBuilder.query;


@Component("ldap")
@AllArgsConstructor
@Slf4j
public class LdapAccountValidator implements AccountValidator{

    private MemberService memberService;

    private OperationLogService operationLogService;


    private OrganizationRepository organizationRepository;


    private LdapTemplate ldapTemplate;

    private LdapContextSource contextSource;

    private String ldapUsernameAttribute;

    @Override
    public Authentication authenticate(Authentication authentication) {
        UserPasswordAuthenticationToken token = (UserPasswordAuthenticationToken) authentication;
        if (StringUtils.isNotBlank(token.getAccount()) && StringUtils.isNotBlank(token.getPassword())) {
            boolean ldapAuthPassCheck = authenticateByLdap(token);
            String memberName = token.getAccount();
            Optional<Member> memberOptional =  memberService.findByAccount(memberName);
            if (!memberOptional.isPresent() && ldapAuthPassCheck) {
                OrganizationMemberModel defaultOrganizeMemberModel =
                        new OrganizationMemberModel(1L, "Default Organize", OrganizationRoleEnum.WRITER);
                Organization organization = organizationRepository.findById(1L).get();
                Member member = new Member();
                member.setAccount(token.getAccount());
                member.setPassword(new BCryptPasswordEncoder().encode(UUID.randomUUID().toString()));
                member.setSource(MemberSourceEnum.PLATFORM.name());
                member.addOrganization(organization,OrganizationRoleEnum.WRITER);
                memberService.save(member);
                return new UserPasswordAuthenticationToken(AuthenticatedMember.create(member,
                        defaultOrganizeMemberModel),
                        Collections.emptyList());
            }
            OperationLog log = new OperationLog(OperationType.LOGIN.name() + "_" + token.getSource(),
                        token.getAccount());
            Member member = memberOptional.get();
            Member immutableMember = new Member();
            BeanUtils.copyProperties(member, immutableMember);
            if (!memberOptional.isPresent() || isAccessTokenNumber(memberOptional)) {
                throw new UsernameNotFoundException("Account not found.");
            }
            boolean passwordMatched = new BCryptPasswordEncoder().matches(token.getPassword(),
                    member.getPassword());
            OrganizationMember organizationMember = member.getOrganizationMembers().get(0);
            OrganizationMemberModel organizationMemberModel = new OrganizationMemberModel(
                    organizationMember.getOrganization().getId(),
                    organizationMember.getOrganization().getName(), organizationMember.getRole());
            if (ldapAuthPassCheck || passwordMatched) {
                if (MemberStatusEnum.ACTIVE.name().equals(member.getStatus().name())) {
                    member.setVisitedTime(new Date());
                    memberService.save(member);
                    operationLogService.save(log);
                    return new UserPasswordAuthenticationToken(AuthenticatedMember.create(immutableMember,
                            organizationMemberModel), Collections.emptyList());
                }
            }
            throw new BadCredentialsException("Credentials are incorrect.");
        }
        throw new BadCredentialsException("Credentials are incorrect.");
    }

    private boolean authenticateByLdap(UserPasswordAuthenticationToken token) {
        try {
            ldapTemplate.authenticate(query().where(ldapUsernameAttribute).is(token.getAccount()),token.getPassword());
            return true;
        } catch (Exception e) {
            log.error("err when authenticate on ldap server {}",e.getMessage());
        }
        return false;
    }

    private boolean isAccessTokenNumber(Optional<Member> member) {
        return StringUtils.equalsIgnoreCase(member.get().getSource(), MemberSourceEnum.ACCESS_TOKEN.name());
    }
}
