package io.featureprobe.api.service


import io.featureprobe.api.base.enums.OrganizationRoleEnum
import io.featureprobe.api.dao.entity.Member
import io.featureprobe.api.dao.entity.Organization
import io.featureprobe.api.dao.entity.OrganizationMember
import io.featureprobe.api.dao.repository.OrganizationMemberRepository
import io.featureprobe.api.dao.repository.OrganizationRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
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
                Optional.of(new OrganizationMember(new Organization(id: 1), new Member(id: 1), OrganizationRoleEnum.OWNER, true))
        1 * organizationRepository.getById(1) >> new Organization(name: "Admin")
        "Admin" == organizationMember.organizationName
    }

    def "find organization by current member"() {
        given:
        setAuthContext("fp@d.com", "OWNER")

        when:
        def organizationResponses = organizationService.findByCurrentMember()

        then:
        1 * organizationMemberRepository.findByMemberId(100) >> [
                new OrganizationMember(organization: new Organization(id: 1, name: "test_org"), member: new Member(account: "fp@d.com"), valid: true)
        ]
        1 == organizationResponses.size()
    }

    private setAuthContext(String account, String role) {
        SecurityContextHolder.setContext(new SecurityContextImpl(
                new JwtAuthenticationToken(new Jwt.Builder("21212").header("a", "a")
                        .claim("role", role).claim("userId", 100L).claim("account", account).build())))
    }
}

