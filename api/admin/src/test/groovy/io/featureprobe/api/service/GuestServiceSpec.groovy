package io.featureprobe.api.service


import io.featureprobe.api.component.SpringBeanManager
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

class GuestServiceSpec extends Specification {

    JWTConfig appConfig

    MemberRepository memberRepository

    ProjectRepository projectRepository

    EnvironmentRepository environmentRepository

    TargetingSketchRepository targetingSketchRepository

    EntityManager entityManager

    OrganizationRepository organizationRepository

    PublishMessageRepository publishMessageRepository

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
        publishMessageRepository = Mock(PublishMessageRepository)
        dictionaryRepository = Mock(DictionaryRepository)
        changeLogService = new ChangeLogService(publishMessageRepository, environmentRepository, dictionaryRepository)
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
        1 * publishMessageRepository.save(_)
        entityManager.createNativeQuery(_) >> query
        20 * query.executeUpdate()
    }

}

