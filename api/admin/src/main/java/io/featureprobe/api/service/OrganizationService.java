package io.featureprobe.api.service;

import io.featureprobe.api.auth.TokenHelper;
import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.dao.entity.Member;
import io.featureprobe.api.dao.entity.Organization;
import io.featureprobe.api.dao.entity.OrganizationMember;
import io.featureprobe.api.dao.exception.ResourceConflictException;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.OrganizationMemberRepository;
import io.featureprobe.api.dao.repository.OrganizationRepository;
import io.featureprobe.api.dto.OrganizationResponse;
import io.featureprobe.api.dto.OrganizationUpdateRequest;
import io.featureprobe.api.mapper.OrganizationMapper;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class OrganizationService {

    OrganizationRepository organizationRepository;

    OrganizationMemberRepository organizationMemberRepository;

    @Transactional(rollbackFor = Throwable.class)
    public OrganizationMemberModel queryOrganizationMember(Long organizationId, Long memberId) {
        OrganizationMember organizationMember =
                organizationMemberRepository.findByOrganizationIdAndMemberId(organizationId, memberId)
                        .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ORGANIZATION_MEMBER,
                                organizationId + "_" + memberId));
        Organization organization = organizationRepository.getById(organizationId);
        return new OrganizationMemberModel(organizationId, organization.getName(), organizationMember.getRole(),
                organizationMember.getValid());
    }

    public List<OrganizationResponse> findByCurrentMember() {
        List<OrganizationMember> organizationMembers = organizationMemberRepository.findByMemberId(
            TokenHelper.getUserId());
        List<Organization> organizations = organizationMembers.stream().filter(
            it -> BooleanUtils.isTrue(it.getValid())).map(
            OrganizationMember::getOrganization).collect(Collectors.toList());

        return organizations.stream().map(organization -> OrganizationMapper.INSTANCE.entityToResponse(organization))
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Throwable.class)
    public OrganizationResponse update(OrganizationUpdateRequest organizationUpdateRequest) {
        Organization organization = getOrganization(TenantContext.getCurrentOrganization().getOrganizationId());

        organization.setName(organizationUpdateRequest.getName());
        organizationRepository.save(organization);
        return OrganizationMapper.INSTANCE.entityToResponse(organization);
    }

    @Transactional(rollbackFor = Throwable.class)
    public void addMemberToOrganization(Long organizationId, Member member,
                                                           OrganizationRoleEnum role, Boolean valid) {
        Organization organization = getOrganization(organizationId);
        OrganizationMember organizationMember = organizationMemberRepository.findByOrganizationIdAndMemberId(
                organizationId, member.getId()).orElse(null);
        if (organizationMember != null) {
            throw new ResourceConflictException(ResourceType.ORGANIZATION_MEMBER);
        }
        organizationMemberRepository.save(new OrganizationMember(organization, member, role, valid));
    }

    private Organization getOrganization(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ORGANIZATION,
                        String.valueOf(id)));
        return organization;
    }

    @Transactional(rollbackFor = Throwable.class)
    public Organization save(Organization organization) {
        return organizationRepository.save(organization);
    }
}
