package io.featureprobe.api.service

import io.featureprobe.api.auth.GuestAuthenticationProvider
import io.featureprobe.api.auth.GuestAuthenticationToken
import io.featureprobe.api.auth.PlaintextEncryptionService
import io.featureprobe.api.base.component.SpringBeanManager
import io.featureprobe.api.config.JWTConfig
import com.featureprobe.sdk.server.FeatureProbe
import io.featureprobe.api.base.enums.OrganizationRoleEnum
import io.featureprobe.api.dao.entity.Dictionary
import io.featureprobe.api.dao.entity.Environment
import io.featureprobe.api.dao.entity.Member
import io.featureprobe.api.dao.entity.Organization
import io.featureprobe.api.dao.entity.OrganizationMember
import io.featureprobe.api.dao.entity.Project
import io.featureprobe.api.dao.repository.DictionaryRepository
import io.featureprobe.api.dao.repository.EnvironmentRepository
import io.featureprobe.api.dao.repository.MemberRepository
import io.featureprobe.api.dao.repository.OperationLogRepository
import io.featureprobe.api.dao.repository.OrganizationMemberRepository
import io.featureprobe.api.dao.repository.OrganizationRepository
import io.featureprobe.api.dao.repository.ProjectRepository
import io.featureprobe.api.dao.repository.PublishMessageRepository
import io.featureprobe.api.dao.repository.TargetingSketchRepository
import org.hibernate.internal.SessionImpl
import org.hibernate.query.spi.NativeQueryImplementor
import org.springframework.context.ApplicationContext
import spock.lang.Specification

import javax.persistence.EntityManager
import javax.persistence.Query

class GuestAuthenticationProviderSpec extends Specification {

    EntityManager entityManager

    MemberRepository memberRepository

    MemberIncludeDeletedService memberIncludeDeletedService

    OrganizationRepository organizationRepository

    OrganizationMemberRepository organizationMemberRepository

    MemberService memberService

    GuestService guestService

    OperationLogRepository operationLogRepository

    OperationLogService operationLogService

    ProjectRepository projectRepository

    EnvironmentRepository environmentRepository

    TargetingSketchRepository targetingSketchRepository

    PublishMessageRepository publishMessageRepository

    DictionaryRepository dictionaryRepository

    ChangeLogService changeLogService

    ProjectService projectService

    JWTConfig jWTConfig = new JWTConfig(guestDefaultPassword: "123")

    ApplicationContext applicationContext

    GuestAuthenticationProvider provider

    def setup() {
        entityManager = Mock(SessionImpl)
        memberRepository = Mock(MemberRepository)
        memberIncludeDeletedService = new MemberIncludeDeletedService(memberRepository, entityManager)
        organizationRepository = Mock(OrganizationRepository)
        organizationMemberRepository = Mock(OrganizationMemberRepository)
        memberService = new MemberService(memberRepository, memberIncludeDeletedService, organizationRepository, organizationMemberRepository, entityManager)
        memberService.setEncryptionName("plaintext")
        projectRepository = Mock(ProjectRepository)
        environmentRepository = Mock(EnvironmentRepository)
        targetingSketchRepository = Mock(TargetingSketchRepository)
        publishMessageRepository = Mock(PublishMessageRepository)
        dictionaryRepository = Mock(DictionaryRepository)
        changeLogService = new ChangeLogService(publishMessageRepository, environmentRepository, dictionaryRepository)
        projectService = new ProjectService(projectRepository, environmentRepository, targetingSketchRepository, changeLogService, entityManager)
        guestService = new GuestService(jWTConfig, memberService, organizationRepository, entityManager, projectService)
        operationLogRepository = Mock(OperationLogRepository)
        operationLogService = new OperationLogService(operationLogRepository)
        applicationContext = Mock(ApplicationContext)
        SpringBeanManager.applicationContext = applicationContext
        provider = new GuestAuthenticationProvider(memberService, guestService, operationLogService)
    }

    def "authenticate token is exist"() {
        given:
        def account = "Test"
        GuestAuthenticationToken authenticationToken = new GuestAuthenticationToken(account, "demo", "123")
        when:
        def authenticate = provider.authenticate(authenticationToken)
        then:
        applicationContext.getBean(_) >> new PlaintextEncryptionService()
        2 * memberRepository.findByAccount(account) >> Optional.of(new Member(account: account,
                organizationMembers: [new OrganizationMember(new Organization(id: 1, name: ""), new Member(), OrganizationRoleEnum.OWNER, true)]))
        1 * memberRepository.save(_)
        1 * operationLogRepository.save(_)
    }

    def "authenticate token not exist"() {
        given:
        Query query = Mock(NativeQueryImplementor)
        GuestAuthenticationToken authenticationToken = new GuestAuthenticationToken("Admin", "demo", "123")
        when:
        def authenticate = provider.authenticate(authenticationToken)
        then:
        applicationContext.getBean("plaintext") >> new PlaintextEncryptionService()
        1 * memberRepository.findByAccount("Admin") >> Optional.empty()
        1 * applicationContext.getBean(_) >> new FeatureProbe("_")
        1 * memberRepository.save(_) >> new Member(id: 1, account: "Admin",
                organizationMembers: [new OrganizationMember(new Organization(id: 1, name: ""), new Member(), OrganizationRoleEnum.OWNER, true)])
        1 * organizationRepository.save(_) >> new Organization(name: "Admin")
        1 * projectRepository.count() >> 2
        1 * projectRepository.save(_) >> new Project(name: "projectName", key: "projectKey",
                environments: [new Environment()])
        1 * dictionaryRepository.findByKey(_) >> Optional.of(new Dictionary(value: "1"))
        1 * dictionaryRepository.save(_)
        1 * publishMessageRepository.save(_)
        entityManager.createNativeQuery(_) >> query
        20 * query.executeUpdate()
        1 * operationLogRepository.save(_)
        null != authenticate
    }


    def "provider supports"() {
        given:
        def account = "Test"
        GuestAuthenticationToken authenticationToken = new GuestAuthenticationToken(account, "demo", "123")
        when:
        def supports = provider.supports(authenticationToken.class)
        then:
        supports
    }
}

