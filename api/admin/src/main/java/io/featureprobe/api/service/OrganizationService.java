package io.featureprobe.api.service;

import io.featureprobe.api.dao.entity.Organization;
import io.featureprobe.api.dao.entity.OrganizationMember;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.OrganizationMemberRepository;
import io.featureprobe.api.dao.repository.OrganizationRepository;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AllArgsConstructor
@Service
public class OrganizationService {

    OrganizationRepository organizationRepository;

    OrganizationMemberRepository organizationMemberRepository;

    @Transactional
    public OrganizationMemberModel queryOrganizationMember(Long organizationId, Long memberId) {
        OrganizationMember organizationMember =
                organizationMemberRepository.findByOrganizationIdAndMemberId(organizationId, memberId)
                        .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ORGANIZATION_MEMBER,
                                organizationId + "_" + memberId));
        Organization organization = organizationRepository.getById(organizationId);
        return new OrganizationMemberModel(organizationId, organization.getName(), organizationMember.getRole());
    }

}
