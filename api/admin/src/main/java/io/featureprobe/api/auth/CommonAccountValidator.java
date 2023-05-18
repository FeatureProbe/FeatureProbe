package io.featureprobe.api.auth;

import com.google.common.collect.Lists;
import io.featureprobe.api.base.enums.MemberSourceEnum;
import io.featureprobe.api.base.enums.MemberStatusEnum;
import io.featureprobe.api.base.enums.OperationType;
import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.OperationLog;
import io.featureprobe.api.dao.entity.Organization;
import io.featureprobe.api.dao.entity.OrganizationMember;
import io.featureprobe.api.dao.repository.OrganizationRepository;
import io.featureprobe.api.service.MemberService;
import io.featureprobe.api.service.OperationLogService;
import lombok.AllArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component("common")
@AllArgsConstructor
public class CommonAccountValidator implements AccountValidator {

    private MemberService memberService;

    private OrganizationRepository organizationRepository;

    private OperationLogService operationLogService;

    @Override
    public Authentication authenticate(Authentication authentication) {
        UserPasswordAuthenticationToken token = (UserPasswordAuthenticationToken) authentication;
        if (StringUtils.isNotBlank(token.getAccount()) && StringUtils.isNotBlank(token.getPassword())) {
            Optional<Member> memberOptional = memberService.findByAccount(token.getAccount());
            OperationLog log = new OperationLog(OperationType.LOGIN.name() + "_" + token.getSource(),
                    token.getAccount());
            if (!memberOptional.isPresent() || isAccessTokenNumber(memberOptional)) {
                throw new UsernameNotFoundException("Account not found.");
            }
            Member member = memberOptional.get();
            if (CollectionUtils.isEmpty(member.getOrganizations())) {
                if (token.isInitializeOrganization()) {
                    Organization organization = Organization.createDefaultOrganization();
                    organization = organizationRepository.save(organization);
                    List<OrganizationMember> organizationMembers = new ArrayList<>(1);
                    organizationMembers.add(new OrganizationMember(organization, member, OrganizationRoleEnum.OWNER));
                    member.setOrganizationMembers(organizationMembers);
                    member = memberService.save(member);
                } else {
                    throw new OrganizationEmptyException("Organization is empty.");
                }
            }
            boolean passwordMatched = new BCryptPasswordEncoder().matches(token.getPassword(),
                    member.getPassword());
            boolean organizationChecked = true;
            OrganizationMemberModel organizationMemberModel = null;
            if (StringUtils.isNotBlank(token.getOrganizationId())) {
                Long organizationId = Long.parseLong(token.getOrganizationId());
                for (OrganizationMember organizationMember : member.getOrganizationMembers()) {
                    if (organizationMember.getOrganization().getId().equals(organizationId)) {
                        Organization organization = organizationMember.getOrganization();
                        organizationMemberModel = new OrganizationMemberModel(organization.getId(),
                                organization.getName(), organizationMember.getRole());
                    }
                }
                if (Objects.isNull(organizationMemberModel)) {
                    throw new BadCredentialsException("Credentials are incorrect.");
                }
            }
            if (Objects.isNull(organizationMemberModel)) {
                OrganizationMember organizationMember = member.getOrganizationMembers().get(0);
                organizationMemberModel = new OrganizationMemberModel(organizationMember.getOrganization().getId(),
                        organizationMember.getOrganization().getName(), organizationMember.getRole());
            }
            if (organizationChecked && passwordMatched &&
                    MemberStatusEnum.ACTIVE.name().equals(member.getStatus().name())) {
                member.setVisitedTime(new Date());
                memberService.save(member);
                operationLogService.save(log);
                return new UserPasswordAuthenticationToken(AuthenticatedMember.create(member,
                        organizationMemberModel), Collections.emptyList());
            }
        }
        return null;
    }

    private boolean isAccessTokenNumber(Optional<Member> member) {
        return StringUtils.equalsIgnoreCase(member.get().getSource(), MemberSourceEnum.ACCESS_TOKEN.name());
    }
}
