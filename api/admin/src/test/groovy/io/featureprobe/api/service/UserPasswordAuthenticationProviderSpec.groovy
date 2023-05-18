package io.featureprobe.api.service

import io.featureprobe.api.auth.AccountValidator
import io.featureprobe.api.auth.CommonAccountValidator
import io.featureprobe.api.auth.LDAPAccountValidator
import io.featureprobe.api.auth.UserPasswordAuthenticationProvider
import io.featureprobe.api.auth.UserPasswordAuthenticationToken
import io.featureprobe.api.base.enums.MemberStatusEnum
import io.featureprobe.api.dao.entity.Member
import io.featureprobe.api.dao.repository.MemberRepository
import io.featureprobe.api.dao.repository.OperationLogRepository
import io.featureprobe.api.dao.repository.OrganizationMemberRepository
import io.featureprobe.api.dao.repository.OrganizationRepository
import org.hibernate.internal.SessionImpl
import spock.lang.Specification

import javax.persistence.EntityManager
import java.lang.reflect.Array

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

    List<AccountValidator> validators


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
        validators = Arrays.asList(new CommonAccountValidator(memberService, operationLogService))
        provider = new UserPasswordAuthenticationProvider(validators)
    }

    def "authenticate token"() {
        given:
        def account = "Test"
        UserPasswordAuthenticationToken authenticationToken = new UserPasswordAuthenticationToken(account, "demo", "abc12345")
        when:
        def authenticate = provider.authenticate(authenticationToken)
        then:
        1 * memberRepository.findByAccount(account) >> Optional.of(new Member(account: account, password: "\$2a\$10\$jeJ25nROU8APkG2ixK6zyecwzIJ8oHz0ZNqBDiwMXcy9lo9S3YGma", status: MemberStatusEnum.ACTIVE))
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

