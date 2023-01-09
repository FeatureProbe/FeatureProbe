package com.featureprobe.api.service

import com.featureprobe.api.auth.GuestAuthenticationToken
import com.featureprobe.api.auth.UserPasswordAuthenticationProvider
import com.featureprobe.api.auth.UserPasswordAuthenticationToken
import com.featureprobe.api.dao.entity.Member
import com.featureprobe.api.dao.repository.MemberRepository
import com.featureprobe.api.dao.repository.OperationLogRepository
import com.featureprobe.api.dao.repository.OrganizationMemberRepository
import com.featureprobe.api.dao.repository.OrganizationRepository
import org.hibernate.internal.SessionImpl
import org.springframework.security.core.Authentication
import spock.lang.Specification

import javax.persistence.EntityManager

class UserPasswordAuthenticationProviderSpec extends Specification {

    EntityManager entityManager

    MemberRepository memberRepository

    MemberIncludeDeletedService memberIncludeDeletedService

    OrganizationRepository organizationRepository

    OrganizationMemberRepository organizationMemberRepository

    MemberService memberService

    OperationLogRepository operationLogRepository

    OperationLogService operationLogService

    UserPasswordAuthenticationProvider provider

    def setup() {
        entityManager = Mock(SessionImpl)
        memberRepository = Mock(MemberRepository)
        memberIncludeDeletedService = new MemberIncludeDeletedService(memberRepository, entityManager)
        organizationRepository = Mock(OrganizationRepository)
        organizationMemberRepository = Mock(OrganizationMemberRepository)
        memberIncludeDeletedService = new MemberIncludeDeletedService(memberRepository, entityManager)
        memberService = new MemberService(memberRepository, memberIncludeDeletedService, organizationRepository, organizationMemberRepository, entityManager)
        operationLogRepository = Mock(OperationLogRepository)
        operationLogService = new OperationLogService(operationLogRepository)
        provider = new UserPasswordAuthenticationProvider(memberService, operationLogService)
    }

    def "authenticate token"() {
        given:
        def account = "Test"
        UserPasswordAuthenticationToken authenticationToken = new UserPasswordAuthenticationToken(account, "demo", "abc12345")
        when:
        def authenticate = provider.authenticate(authenticationToken)
        then:
        1 * memberRepository.findByAccount(account) >> Optional.of(new Member(account: account, password: "\$2a\$10\$jeJ25nROU8APkG2ixK6zyecwzIJ8oHz0ZNqBDiwMXcy9lo9S3YGma"))
        1 *  memberRepository.findByAccount(account) >> Optional.of(new Member(account: account))
        1 * memberRepository.save(_)
        1 * operationLogRepository.save(_)
        null != authenticate
    }

    def "provider supports"() {
        given:
        def account = "Test"
        UserPasswordAuthenticationToken authenticationToken = new UserPasswordAuthenticationToken(account, "demo", "123")
        when:
        def supports = provider.supports(authenticationToken.class)
        then:
        supports
    }

}

