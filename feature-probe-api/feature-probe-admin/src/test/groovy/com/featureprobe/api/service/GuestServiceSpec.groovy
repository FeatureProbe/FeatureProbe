package com.featureprobe.api.service

import com.featureprobe.api.base.enums.OrganizationRoleEnum
import com.featureprobe.api.component.SpringBeanManager
import com.featureprobe.api.config.JWTConfig
import com.featureprobe.api.base.enums.RoleEnum
import com.featureprobe.api.dao.entity.Dictionary
import com.featureprobe.api.dao.entity.Environment
import com.featureprobe.api.dao.entity.Member
import com.featureprobe.api.dao.entity.Organization
import com.featureprobe.api.dao.entity.OrganizationMember
import com.featureprobe.api.dao.entity.Project
import com.featureprobe.api.dao.repository.OrganizationRepository
import com.featureprobe.api.dao.repository.PublishMessageRepository
import com.featureprobe.api.dao.repository.DictionaryRepository
import com.featureprobe.api.dao.repository.EnvironmentRepository
import com.featureprobe.api.dao.repository.MemberRepository
import com.featureprobe.api.dao.repository.ProjectRepository
import com.featureprobe.api.dao.repository.TargetingSketchRepository
import com.featureprobe.sdk.server.FeatureProbe
import org.hibernate.internal.SessionImpl
import org.hibernate.query.spi.NativeQueryImplementor
import org.springframework.context.ApplicationContext
import spock.lang.Specification

import javax.persistence.EntityManager
import javax.persistence.Query

class GuestServiceSpec extends Specification {

    JWTConfig appConfig

    MemberRepository memberRepository

    ProjectRepository projectRepository

    EnvironmentRepository environmentRepository

    TargetingSketchRepository targetingSketchRepository

    EntityManager entityManager

    OrganizationRepository organizationRepository

    PublishMessageRepository changeLogRepository

    DictionaryRepository dictionaryRepository

    ChangeLogService changeLogService

    ProjectService projectService

    GuestService guestService

    ApplicationContext applicationContext

    def setup() {
        appConfig = new JWTConfig()
        appConfig.setGuestDefaultPassword("Password")
        memberRepository = Mock(MemberRepository)
        entityManager = Mock(SessionImpl)
        projectRepository = Mock(ProjectRepository)
        environmentRepository = Mock(EnvironmentRepository)
        organizationRepository = Mock(OrganizationRepository)
        targetingSketchRepository = Mock(TargetingSketchRepository)
        changeLogRepository = Mock(PublishMessageRepository)
        dictionaryRepository = Mock(DictionaryRepository)
        changeLogService = new ChangeLogService(changeLogRepository, environmentRepository, dictionaryRepository)
        projectService = new ProjectService(projectRepository, environmentRepository, targetingSketchRepository, changeLogService, entityManager)
        guestService = new GuestService(appConfig, memberRepository, organizationRepository, entityManager, projectService)
        applicationContext = Mock(ApplicationContext)
        SpringBeanManager.applicationContext = applicationContext
    }

    def "init guest data"() {
        given:
        Query query = Mock(NativeQueryImplementor)
        when:
        def guest = guestService.initGuest("Admin", "test")
        then:
        1 * applicationContext.getBean(_) >> new FeatureProbe("_")
        1 * memberRepository.save(_) >> new Member(id: 1, account: "Admin",
                organizationMembers: [new OrganizationMember(role: OrganizationRoleEnum.OWNER)])
        1 * organizationRepository.save(_) >> new Organization(name: "Admin")
        1 * projectRepository.count() >> 2
        1 * projectRepository.save(_) >> new Project(name: "projectName", key: "projectKey",
                environments: [new Environment()])
        1 * dictionaryRepository.findByKey(_) >> Optional.of(new Dictionary(value: "1"))
        1 * dictionaryRepository.save(_)
        1 * changeLogRepository.save(_)
        entityManager.createNativeQuery(_) >> query
        20 * query.executeUpdate()
    }

}

