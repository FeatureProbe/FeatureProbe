package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.constants.MessageKey;
import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.exception.ForbiddenException;
import com.featureprobe.api.base.tenant.TenantContext;
import com.featureprobe.api.dao.entity.Member;
import com.featureprobe.api.dao.entity.Organization;
import com.featureprobe.api.dao.entity.OrganizationMember;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.MemberRepository;
import com.featureprobe.api.dao.repository.OrganizationMemberRepository;
import com.featureprobe.api.dao.repository.OrganizationRepository;
import com.featureprobe.api.dao.utils.PageRequestUtil;
import com.featureprobe.api.dto.MemberCreateRequest;
import com.featureprobe.api.dto.MemberModifyPasswordRequest;
import com.featureprobe.api.dto.MemberItemResponse;
import com.featureprobe.api.dto.MemberResponse;
import com.featureprobe.api.dto.MemberSearchRequest;
import com.featureprobe.api.dto.MemberUpdateRequest;
import com.featureprobe.api.mapper.MemberMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@ExcludeTenant
@Slf4j
@Service
@AllArgsConstructor
public class MemberService {

    private MemberRepository memberRepository;

    private MemberIncludeDeletedService memberIncludeDeletedService;

    private OrganizationRepository organizationRepository;

    private OrganizationMemberRepository organizationMemberRepository;

    @PersistenceContext
    public EntityManager entityManager;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional(rollbackFor = Exception.class)
    public List<MemberResponse> create(MemberCreateRequest createRequest) {
        List<Member> savedMembers = memberRepository.saveAll(newNumbers(createRequest));
        return savedMembers.stream().map(item -> translateResponse(item)).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class)
    public MemberResponse update(MemberUpdateRequest updateRequest) {
        verifyAdminPrivileges();
        Member member = findMemberByAccount(updateRequest.getAccount());
        MemberMapper.INSTANCE.mapEntity(updateRequest, member);
        OrganizationMember organizationMember = member.getOrganizationMembers()
                .stream()
                .filter(it -> it.getOrganization().getId().equals(TenantContext.getCurrentOrganization()
                        .getOrganizationId())).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ORGANIZATION_MEMBER,
                        member.getAccount()));
        organizationMember.setRole(updateRequest.getRole());
        return translateResponse(memberRepository.save(member));
    }

    @Transactional(rollbackFor = Exception.class)
    public MemberItemResponse modifyPassword(MemberModifyPasswordRequest modifyPasswordRequest) {
        Member member = findLoggedInMember();
        verifyPassword(modifyPasswordRequest.getOldPassword(), member.getPassword());
        member.setPassword(passwordEncoder.encode(modifyPasswordRequest.getNewPassword()));
        return MemberMapper.INSTANCE.entityToItemResponse(memberRepository.save(member));
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateVisitedTime(String account) {
        Member member = findMemberByAccount(account);
        member.setVisitedTime(new Date());
        memberRepository.save(member);
    }

    @Transactional(rollbackFor = Exception.class)
    public MemberResponse delete(String account) {
        verifyAdminPrivileges();
        Member member = findMemberByAccount(account);
        member.setDeleted(true);
        member.deleteOrganization(Long.parseLong(TenantContext.getCurrentTenant()));
        memberRepository.save(member);
        return translateResponse(member);
    }

    private MemberResponse translateResponse(Member member) {
        MemberResponse memberResponse = MemberMapper.INSTANCE.entityToResponse(member);
        OrganizationRoleEnum role = member.getRole(Long.parseLong(TenantContext.getCurrentTenant()));
        memberResponse.setRole(role == null ? null : role.name());
        return memberResponse;
    }

    private List<Member> newNumbers(MemberCreateRequest createRequest) {
        return createRequest.getAccounts()
                .stream()
                .filter(account -> memberIncludeDeletedService.validateAccountIncludeDeleted(account))
                .map(account -> newMember(account, createRequest))
                .collect(Collectors.toList());
    }

    private Member newMember(String account, MemberCreateRequest createRequest) {
        Member member = new Member();
        member.setAccount(account);
        member.setSource(createRequest.getSource());
        member.setPassword(new BCryptPasswordEncoder().encode(createRequest.getPassword()));

        Organization organization = organizationRepository.findById(TenantContext.getCurrentOrganization()
                .getOrganizationId()).get();
        member.addOrganization(organization, createRequest.getRole());

        return member;
    }

    private void verifyPassword(String oldPassword, String newPassword) {
        if (!passwordEncoder.matches(oldPassword, newPassword)) {
            throw new IllegalArgumentException(MessageKey.INVALID_OLD_PASSWORD);
        }
    }

    public Optional<Member> findByAccount(String account) {
        return memberRepository.findByAccount(account);
    }

    private void verifyAdminPrivileges() {
        if (!TokenHelper.isOwner()) {
            throw new ForbiddenException();
        }
    }

    public Page<MemberItemResponse> list(MemberSearchRequest searchRequest) {
        Pageable pageable = PageRequestUtil.toPageable(searchRequest, Sort.Direction.DESC, "createdTime");
        Specification<OrganizationMember> spec = (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("organization").get("id"), TenantContext.getCurrentOrganization()
                    .getOrganizationId());
            return query.where(cb.and(p1)).getRestriction();
        };
        Page<OrganizationMember> organizationMembers = organizationMemberRepository.findAll(spec, pageable);
        List<Long> memberIds = organizationMembers.getContent()
                .stream()
                .map(organizationMember -> organizationMember.getMember().getId())
                .collect(Collectors.toList());
        Map<Long, Member> idToMember = memberRepository.findAllById(memberIds).stream()
                .collect(Collectors.toMap(Member::getId, Function.identity()));

        return convertToResponse(getOwnerTotalCount(),
                TokenHelper.isOwner(),
                organizationMembers, idToMember);
    }

    private long getOwnerTotalCount() {
        Specification<OrganizationMember> spec = (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("organization").get("id"), TenantContext.getCurrentOrganization()
                    .getOrganizationId());
            Predicate p2 = cb.equal(root.get("role"), OrganizationRoleEnum.OWNER);
            return query.where(cb.and(p1, p2)).getRestriction();
        };
        return organizationMemberRepository.count(spec);

    }

    private Page<MemberItemResponse> convertToResponse(long ownerCount,
                                                       boolean currentIsOwner,
                                                       Page<OrganizationMember> organizationMembers,
                                                       Map<Long, Member> idToMember) {
        return organizationMembers.map(item -> {
            MemberItemResponse response = MemberMapper.INSTANCE
                    .entityToItemResponse(idToMember.get(item.getMember().getId()));
            if (item.getRole() == null) {
                response.setAllowEdit(false);
                return response;
            }
            response.setRole(item.getRole().name());
            boolean allowEdit = currentIsOwner;

            if (allowEdit && item.getRole().isOwner() && ownerCount == 1) {
                allowEdit = false;
            }
            response.setAllowEdit(allowEdit);
            return response;
        });
    }

    public MemberItemResponse queryByAccount(String account) {
        Member member = findMemberByAccount(account, true);
        return MemberMapper.INSTANCE.entityToItemResponse(member);
    }

    private Member findLoggedInMember() {
        return findMemberByAccount(TokenHelper.getAccount());
    }

    private Member findMemberByAccount(String account) {
        return findMemberByAccount(account, false);
    }

    private Member findMemberByAccount(String account, boolean includeDeleted) {
        Optional<Member> member = includeDeleted ? memberIncludeDeletedService
                .queryMemberByAccountIncludeDeleted(account) : memberRepository.findByAccount(account);
        return member.orElseThrow(() -> new ResourceNotFoundException(ResourceType.MEMBER, account));
    }

    public Optional<Member> findById(Long memberId) {
        return memberRepository.findById(memberId);
    }

}
