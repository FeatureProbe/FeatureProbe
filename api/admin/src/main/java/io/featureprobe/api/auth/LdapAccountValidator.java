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
import io.featureprobe.api.dao.repository.OrganizationRepository;
import io.featureprobe.api.dto.MemberCreateRequest;
import io.featureprobe.api.service.MemberService;
import io.featureprobe.api.service.OperationLogService;
import io.featureprobe.api.service.OrganizationService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
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
        boolean ldapAuthPassCheck = authenticateByLdap(token);
        OrganizationMemberModel defaultOrganizeMemberModel =
                new OrganizationMemberModel(1L, "Default Organize", OrganizationRoleEnum.WRITER);
        String memberName = token.getAccount();
        Optional<Member> memberOptional =  memberService.findByAccount(memberName);
        if (!memberOptional.isPresent() && ldapAuthPassCheck) {
            Organization organization = organizationRepository.findById(1L).get();
            Member member = new Member();
            member.setAccount(token.getAccount());
            member.setPassword(new BCryptPasswordEncoder().encode(token.getPassword()));
            member.setSource(MemberSourceEnum.PLATFORM.name());
            member.addOrganization(organization,OrganizationRoleEnum.WRITER);
            memberService.save(member);
            return new UserPasswordAuthenticationToken(AuthenticatedMember.create(member,
                    defaultOrganizeMemberModel),
                    Collections.emptyList());
        }
        OperationLog log = new OperationLog(OperationType.LOGIN.name() + "_" + token.getSource(),
                    token.getAccount());
        if (!memberOptional.isPresent() || isAccessTokenNumber(memberOptional)) {
            throw new UsernameNotFoundException("Account not found.");
        }
        Member member = memberOptional.get();
        boolean passwordMatched = new BCryptPasswordEncoder().matches(token.getPassword(),
                member.getPassword());
        if (passwordMatched &&
                MemberStatusEnum.ACTIVE.name().equals(member.getStatus().name())) {
            member.setVisitedTime(new Date());
            operationLogService.save(log);
            return new UserPasswordAuthenticationToken(AuthenticatedMember.create(member,
                    defaultOrganizeMemberModel), Collections.emptyList());
        }
        throw new BadCredentialsException("Credentials are incorrect.");
    }

    private boolean authenticateByLdap(UserPasswordAuthenticationToken token) {
        try {
            ldapTemplate.authenticate(query().where(ldapUsernameAttribute).is(token.getAccount()),token.getPassword());
            return true;
        }catch (EmptyResultDataAccessException e) {
            throw new UsernameNotFoundException("Account not find on Ldap Server."+e.getMessage());
        } catch (AuthenticationCredentialsNotFoundException e) {
            throw new UsernameNotFoundException("Account password not correct on Ldap Server."+e.getMessage());
        } catch (Exception e) {
            log.error("err when authenticate on ldap server {}",e.getMessage());
        }
        return false;
    }

    private boolean isAccessTokenNumber(Optional<Member> member) {
        return StringUtils.equalsIgnoreCase(member.get().getSource(), MemberSourceEnum.ACCESS_TOKEN.name());
    }
}
