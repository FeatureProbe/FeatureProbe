package io.featureprobe.api.service

import io.featureprobe.api.auth.AccessTokenAuthenticationProvider
import io.featureprobe.api.auth.AccessTokenAuthenticationToken
import io.featureprobe.api.auth.PlaintextEncryptionService
import io.featureprobe.api.base.component.SpringBeanManager
import io.featureprobe.api.dao.entity.AccessToken
import io.featureprobe.api.dao.entity.Member
import io.featureprobe.api.dao.repository.AccessTokenRepository
import io.featureprobe.api.dao.repository.MemberRepository
import io.featureprobe.api.dao.repository.OperationLogRepository
import io.featureprobe.api.dao.repository.OrganizationMemberRepository
import io.featureprobe.api.dao.repository.OrganizationRepository
import org.hibernate.internal.SessionImpl
import org.springframework.context.ApplicationContext
import spock.lang.Specification

import javax.persistence.EntityManager

class AccessTokenAuthenticationProviderSpec extends Specification {

    EntityManager entityManager
    MemberRepository memberRepository
    MemberIncludeDeletedService memberIncludeDeletedService
    OrganizationRepository organizationRepository
    OrganizationMemberRepository organizationMemberRepository
    MemberService memberService
    AccessTokenRepository accessTokenRepository
    AccessTokenService accessTokenService
    OperationLogRepository operationLogRepository
    OperationLogService operationLogService
    AccessTokenAuthenticationProvider provider
    ApplicationContext applicationContext

    def setup() {
        entityManager = Mock(SessionImpl)
        memberRepository = Mock(MemberRepository)
        organizationRepository = Mock(OrganizationRepository)
        organizationMemberRepository = Mock(OrganizationMemberRepository)
        accessTokenRepository = Mock(AccessTokenRepository)
        operationLogRepository = Mock(OperationLogRepository)
        memberIncludeDeletedService = new MemberIncludeDeletedService(memberRepository, entityManager)
        memberService = new MemberService(memberRepository, memberIncludeDeletedService, organizationRepository, organizationMemberRepository, entityManager)
        accessTokenService = new AccessTokenService(accessTokenRepository, entityManager, memberService)
        operationLogService = new OperationLogService(operationLogRepository)
        provider = new AccessTokenAuthenticationProvider(memberService, accessTokenService, operationLogService)
        applicationContext = Mock(ApplicationContext)
        SpringBeanManager.applicationContext = applicationContext
    }


    def "Authenticate Token"() {

        given:
        def token = "api-123"
        AccessTokenAuthenticationToken authenticationToken = new AccessTokenAuthenticationToken(token)
        when:
        def authenticate = provider.authenticate(authenticationToken)
        then:
        applicationContext.getBean(_) >> new PlaintextEncryptionService()
        1 * accessTokenRepository.findByToken(token) >> Optional.of(new AccessToken(id: 1, memberId: 1, organizationId: 1))
        1 * memberRepository.findById(1) >> Optional.of(new Member(account: "api:test"))
        1 * memberRepository.save(_)
        1 * accessTokenRepository.findById(1) >> Optional.of(new AccessToken())
        1 * accessTokenRepository.save(_)
        1 * operationLogRepository.save(_)
        null != authenticate
    }

    def "Provider supports"() {
        given:
        def token = "api-123"
        AccessTokenAuthenticationToken authenticationToken = new AccessTokenAuthenticationToken(token)
        when:
        def supports = provider.supports(authenticationToken.class)
        then:
        supports
    }


}

