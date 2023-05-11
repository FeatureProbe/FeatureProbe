package io.featureprobe.api.service


import io.featureprobe.api.dto.AccessTokenCreateRequest
import io.featureprobe.api.dto.AccessTokenSearchRequest
import io.featureprobe.api.base.enums.AccessTokenType
import io.featureprobe.api.base.enums.OrganizationRoleEnum
import io.featureprobe.api.base.model.OrganizationMemberModel
import io.featureprobe.api.base.tenant.TenantContext
import io.featureprobe.api.dao.entity.AccessToken
import io.featureprobe.api.dao.entity.Member
import io.featureprobe.api.dao.entity.Organization
import io.featureprobe.api.dao.exception.ResourceConflictException
import io.featureprobe.api.dao.exception.ResourceNotFoundException
import io.featureprobe.api.dao.repository.AccessTokenRepository
import io.featureprobe.api.dao.repository.MemberRepository
import io.featureprobe.api.dao.repository.OrganizationMemberRepository
import io.featureprobe.api.dao.repository.OrganizationRepository
import org.hibernate.internal.SessionImpl
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import spock.lang.Specification

import javax.persistence.EntityManager

class AccessTokenServiceSpec extends Specification {

    AccessTokenRepository accessTokenRepository

    MemberRepository memberRepository

    MemberIncludeDeletedService memberIncludeDeletedService

    OrganizationRepository organizationRepository

    OrganizationMemberRepository organizationMemberRepository

    EntityManager entityManager

    MemberService memberService

    AccessTokenService accessTokenService

    def setup() {
        entityManager = Mock(SessionImpl)
        memberRepository = Mock(MemberRepository)
        organizationRepository = Mock(OrganizationRepository)
        organizationMemberRepository = Mock(OrganizationMemberRepository)
        memberIncludeDeletedService = new MemberIncludeDeletedService(memberRepository, entityManager)
        memberService = new MemberService(memberRepository, memberIncludeDeletedService, organizationRepository, organizationMemberRepository, entityManager)
        accessTokenRepository = Mock(AccessTokenRepository)
        accessTokenService = new AccessTokenService(accessTokenRepository, entityManager, memberService)
        TenantContext.setCurrentOrganization(new OrganizationMemberModel(1, "organization", OrganizationRoleEnum.OWNER))
        TenantContext.setCurrentTenant("1")
    }

    def "create a application access token"() {
        given:
        def name = "Test token"
        def token = "api-123abc"
        AccessTokenCreateRequest request = new AccessTokenCreateRequest(name: name, role: OrganizationRoleEnum.OWNER, type: AccessTokenType.APPLICATION)
        when:
        def create = accessTokenService.create(request)
        then:
        1 * accessTokenRepository.existsByNameAndType(name, AccessTokenType.APPLICATION)
        1 * memberRepository.existsByAccount("api:" + name) >> false
        1 * memberRepository.findByAccount("api:" + name) >> Optional.of(new Member(id: 1))
        1 * organizationRepository.findById(1) >> Optional.of(new Organization(name: "organization"))
        1 * memberRepository.saveAll(_) >> [new Member(account: "api:" + name)]
        1 * accessTokenRepository.save(_) >> new AccessToken(token: token)
        token == create.token
    }

    def "create a person access token"() {
        given:
        def name = "Test token"
        def token = "api-123abc"
        AccessTokenCreateRequest request = new AccessTokenCreateRequest(name: name, role: OrganizationRoleEnum.OWNER, type: AccessTokenType.PERSON)
        when:
        def create = accessTokenService.create(request)
        then:
        1 * accessTokenRepository.existsByNameAndType(name, AccessTokenType.PERSON)
        1 * accessTokenRepository.save(_) >> new AccessToken(token: token)
        token == create.token
    }

    def "delete a access token"() {
        given:
        def tokenId = 1
        def memberId = 2
        def name = "Test Token"
        setAuthContext("Admin", "OWNER")
        when:
        def delete = accessTokenService.delete(tokenId)
        then:
        1 * accessTokenRepository.findById(tokenId) >> Optional.of(new AccessToken(id: tokenId, name: name, memberId: memberId, type: AccessTokenType.APPLICATION))
        1 * memberRepository.findById(memberId) >> Optional.of(new Member())
        1 * memberRepository.findByAccount(_) >> Optional.of(new Member())
        1 * memberRepository.save(_)
        1 * accessTokenRepository.save(_) >> new AccessToken(name: name, id: tokenId)
        name == delete.name
    }

    def "query access token list"() {
        given:
        def id = 1
        def name = "Test Token"
        def token = "api-123abc"
        when:
        def list = accessTokenService.list(new AccessTokenSearchRequest(type: AccessTokenType.APPLICATION))
        then:
        1 * accessTokenRepository.findAll(_, _) >> new PageImpl<>([new AccessToken(id: id, name: name)],
                PageRequest.of(1, 10), 1)
        1 == list.content.size()
    }

    def "query a access token by id"() {
        given:
        def id = 1
        def name = "Test Token"
        def token = "api-123abc"
        when:
        def accessToken = accessTokenService.queryById(id)
        then:
        1 * accessTokenRepository.findById(id) >> Optional.of(new AccessToken(id: id, name: name, token: token))
        name == accessToken.name
    }

    def "validate access token exists"() {
        given:
        def name = "Test Token"
        when:
        def exists = accessTokenService.validateExists(name, AccessTokenType.APPLICATION)
        then:
        1 * accessTokenRepository.existsByNameAndType(name, AccessTokenType.APPLICATION) >> true
        thrown(ResourceConflictException.class)
    }

    def "find a access token By Token"() {
        given:
        def token = "api-123abc"
        when:
        def accessToken = accessTokenService.findByToken(token)
        then:
        1 * accessTokenRepository.findByToken(token) >> Optional.of(new AccessToken())
        accessToken.isPresent()
    }

    def "update access token visited Time"() {
        given:
        def id = 1
        when:
        accessTokenService.updateVisitedTime(id)
        then:
        1 * accessTokenRepository.findById(id) >> Optional.of(new AccessToken())
        1 * accessTokenRepository.save(_)
    }

    def "update access token visited Time error not found"() {
        given:
        def id = 1
        when:
        accessTokenService.updateVisitedTime(id)
        then:
        1 * accessTokenRepository.findById(id) >> Optional.empty()
        thrown(ResourceNotFoundException.class)
    }


    private setAuthContext(String account, String role) {
        SecurityContextHolder.setContext(new SecurityContextImpl(
                new JwtAuthenticationToken(new Jwt.Builder("21212").header("a", "a")
                        .claim("role", role).claim("account", account).build())))
    }

}

