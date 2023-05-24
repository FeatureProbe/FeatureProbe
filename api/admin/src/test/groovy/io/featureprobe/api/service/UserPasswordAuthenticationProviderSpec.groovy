package io.featureprobe.api.service

import io.featureprobe.api.auth.AccountValidator
import io.featureprobe.api.auth.CommonAccountValidator
import io.featureprobe.api.auth.LdapAccountValidator
import io.featureprobe.api.auth.PlaintextEncryptionService
import io.featureprobe.api.auth.UserPasswordAuthenticationProvider
import io.featureprobe.api.auth.UserPasswordAuthenticationToken
import io.featureprobe.api.base.component.SpringBeanManager
import io.featureprobe.api.base.enums.MemberStatusEnum
import io.featureprobe.api.base.enums.OrganizationRoleEnum
import io.featureprobe.api.dao.entity.Member
import io.featureprobe.api.dao.entity.Organization
import io.featureprobe.api.dao.entity.OrganizationMember
import io.featureprobe.api.dao.repository.MemberRepository
import io.featureprobe.api.dao.repository.OperationLogRepository
import io.featureprobe.api.dao.repository.OrganizationMemberRepository
import io.featureprobe.api.dao.repository.OrganizationRepository
import org.hibernate.internal.SessionImpl
import org.springframework.context.ApplicationContext
import org.springframework.ldap.core.LdapTemplate
import org.springframework.ldap.core.support.LdapContextSource
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


    ApplicationContext applicationContext

    LdapTemplate ldapTemplate;

    LdapContextSource ldapContextSource;

    LdapAccountValidator ldapAccountValidator;

    CommonAccountValidator commonAccountValidator;

    def setup() {
        entityManager = Mock(SessionImpl)
        memberRepository = Mock(MemberRepository)
        memberIncludeDeletedService = new MemberIncludeDeletedService(memberRepository, entityManager)
        organizationRepository = Mock(OrganizationRepository)
        organizationMemberRepository = Mock(OrganizationMemberRepository)
        ldapContextSource = Mock(LdapContextSource);
        ldapTemplate = Mock(LdapTemplate);
        memberIncludeDeletedService = new MemberIncludeDeletedService(memberRepository, entityManager)
        memberService = new MemberService(memberRepository, memberIncludeDeletedService, organizationRepository, organizationMemberRepository, entityManager)
        operationLogRepository = Mock(OperationLogRepository)
        operationLogService = new OperationLogService(operationLogRepository)
        commonAccountValidator = new CommonAccountValidator(memberService, organizationRepository, operationLogService)
        ldapAccountValidator = new LdapAccountValidator(memberService,operationLogService,organizationRepository,ldapTemplate,ldapContextSource);
        provider = new UserPasswordAuthenticationProvider()
        applicationContext = Mock(ApplicationContext)
        SpringBeanManager.applicationContext = applicationContext
    }

    def "authenticate token by Ldap"() {
        given:
        def account = "Test"
        UserPasswordAuthenticationToken authenticationToken = new UserPasswordAuthenticationToken(account, "demo", "abc12345", "1", false)
        when:
        def authenticate = provider.authenticate(authenticationToken)
        then:
        assert ldapTemplate == ldapAccountValidator.ldapTemplate
        1 * applicationContext.getBean(_) >> ldapAccountValidator
        1 * applicationContext.getBean(_) >> new PlaintextEncryptionService()
        1 * ldapTemplate.authenticate(_, _) >> { query,password ->
            String uid = query.filter().toString().split("=")[1]
            return uid == "Test" && password == "abc12345"
        }
        1 * memberRepository.findByAccount(account) >> Optional.of(new Member(account: account, password: "\$2a\$10\$jeJ25nROU8APkG2ixK6zyecwzIJ8oHz0ZNqBDiwMXcy9lo9S3YGma", status: MemberStatusEnum.ACTIVE,
                organizationMembers: [new OrganizationMember(new Organization(id: 1, name: ""), new Member(), OrganizationRoleEnum.OWNER, true)]))
        1 * operationLogRepository.save(_)
        null != authenticate
    }

    def "authenticate token"() {
        given:
        def account = "Test"
        UserPasswordAuthenticationToken authenticationToken = new UserPasswordAuthenticationToken(account, "demo", "abc12345", "1", false)
        when:
        def authenticate = provider.authenticate(authenticationToken)
        then:
        1 * applicationContext.getBean(_) >> commonAccountValidator
        1 * applicationContext.getBean(_) >> new PlaintextEncryptionService()
        1 * memberRepository.findByAccount(account) >> Optional.of(new Member(account: account, password: "\$2a\$10\$jeJ25nROU8APkG2ixK6zyecwzIJ8oHz0ZNqBDiwMXcy9lo9S3YGma", status: MemberStatusEnum.ACTIVE,
                organizationMembers: [new OrganizationMember(new Organization(id: 1, name: ""), new Member(), OrganizationRoleEnum.OWNER, true)]))
        1 * memberRepository.save(_)
        1 * operationLogRepository.save(_)
        null != authenticate
    }

    def "provider supports"() {
        given:
        def account = "Test"
        UserPasswordAuthenticationToken authenticationToken = new UserPasswordAuthenticationToken(account, "demo", "123","1" , false)
        when:
        def supports = provider.supports(authenticationToken.class)
        then:
        supports
    }

}

