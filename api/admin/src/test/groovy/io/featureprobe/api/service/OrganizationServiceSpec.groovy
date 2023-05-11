package io.featureprobe.api.service


import io.featureprobe.api.base.enums.OrganizationRoleEnum
import io.featureprobe.api.dao.entity.Member
import io.featureprobe.api.dao.entity.Organization
import io.featureprobe.api.dao.entity.OrganizationMember
import io.featureprobe.api.dao.repository.OrganizationMemberRepository
import io.featureprobe.api.dao.repository.OrganizationRepository
import spock.lang.Specification

class OrganizationServiceSpec extends Specification {

    OrganizationRepository organizationRepository
    OrganizationMemberRepository organizationMemberRepository
    OrganizationService organizationService

    def setup() {
        organizationRepository = Mock(OrganizationRepository)
        organizationMemberRepository = Mock(OrganizationMemberRepository)
        organizationService = new OrganizationService(organizationRepository, organizationMemberRepository)
    }

    def "query organization member"() {
        when:
        def organizationMember = organizationService.queryOrganizationMember(1, 1)
        then:
        1 * organizationMemberRepository.findByOrganizationIdAndMemberId(1, 1) >>
                Optional.of(new OrganizationMember(new Organization(id: 1), new Member(id: 1), OrganizationRoleEnum.OWNER))
        1 * organizationRepository.getById(1) >> new Organization(name: "Admin")
        "Admin" == organizationMember.organizationName
    }
}

