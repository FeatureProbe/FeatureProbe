package io.featureprobe.api.service

import io.featureprobe.api.base.component.SpringBeanManager
import io.featureprobe.api.dto.EnvironmentCreateRequest
import io.featureprobe.api.dto.EnvironmentQueryRequest
import io.featureprobe.api.dto.EnvironmentUpdateRequest
import io.featureprobe.api.dao.repository.TargetingRepository
import com.featureprobe.sdk.server.FeatureProbe
import io.featureprobe.api.base.enums.ValidateTypeEnum
import io.featureprobe.api.dao.entity.Dictionary
import io.featureprobe.api.dao.entity.Environment
import io.featureprobe.api.dao.entity.Project
import io.featureprobe.api.dao.entity.Targeting
import io.featureprobe.api.dao.entity.Toggle
import io.featureprobe.api.dao.exception.ResourceConflictException
import io.featureprobe.api.dao.repository.DictionaryRepository
import io.featureprobe.api.dao.repository.EnvironmentRepository
import io.featureprobe.api.dao.repository.ProjectRepository
import io.featureprobe.api.dao.repository.PublishMessageRepository
import io.featureprobe.api.dao.repository.ToggleRepository
import org.hibernate.internal.SessionImpl
import org.springframework.context.ApplicationContext
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import spock.lang.Specification
import javax.persistence.EntityManager

class EnvironmentServiceSpec extends Specification {


    ProjectRepository projectRepository

    EnvironmentRepository environmentRepository

    ToggleRepository toggleRepository

    TargetingRepository targetingRepository

    EnvironmentService environmentService

    TargetingService targetingService

    PublishMessageRepository publishMessageRepository

    DictionaryRepository dictionaryRepository

    ChangeLogService changeLogService

    EnvironmentCreateRequest createRequest

    EnvironmentUpdateRequest updateRequest

    EntityManager entityManager

    IncludeArchivedEnvironmentService includeArchivedEnvironmentService

    IncludeArchivedToggleService includeArchivedToggleService

    ApplicationContext applicationContext

    def projectName
    def projectKey
    def environmentName
    def environmentKey
    def serverSdkKey
    def clientSdkKey
    def toggleName
    def toggleKey

    def setup() {
        projectName = "test_project_name"
        projectKey = "test_project"
        environmentName = "test_env_name"
        environmentKey = "test_env"
        serverSdkKey = "server-232323"
        clientSdkKey = "client-dasda3"
        toggleName = "test_toggle_name"
        toggleKey = "test_toggle_key"
        projectRepository = Mock(ProjectRepository)
        environmentRepository = Mock(EnvironmentRepository)
        toggleRepository = Mock(ToggleRepository)
        targetingRepository = Mock(TargetingRepository)
        targetingService = Mock(TargetingService)
        entityManager = Mock(SessionImpl)
        publishMessageRepository = Mock(PublishMessageRepository)
        dictionaryRepository = Mock(DictionaryRepository)

        includeArchivedToggleService = new IncludeArchivedToggleService(toggleRepository, entityManager)
        changeLogService = new ChangeLogService(publishMessageRepository, environmentRepository, dictionaryRepository)
        environmentService = new EnvironmentService(environmentRepository, projectRepository,
                targetingRepository, changeLogService, includeArchivedToggleService, targetingService, entityManager)
        includeArchivedEnvironmentService = new IncludeArchivedEnvironmentService(environmentRepository, entityManager)
        createRequest = new EnvironmentCreateRequest(name: environmentName, key: environmentKey)
        updateRequest = new EnvironmentUpdateRequest(name: "env_test_update", resetServerSdk: true, resetClientSdk: true)
        setAuthContext("Admin", "ADMIN")
        applicationContext = Mock(ApplicationContext)
        SpringBeanManager.applicationContext = applicationContext
    }

    def "create environment"() {
        when:
        def ret = environmentService.create(projectKey, createRequest)
        then:
        1 * applicationContext.getBean(_) >> new FeatureProbe("_")
        1 * projectRepository.findByKey(projectKey) >>
                new Optional<>(new Project(name: projectName, key: projectKey))
        1 * environmentRepository.save(_) >> new Environment(name: environmentName, key: environmentKey,
                serverSdkKey: serverSdkKey, clientSdkKey: clientSdkKey, version: 1)
        1 * toggleRepository.findAllByProjectKey(projectKey) >> [new Toggle(name: toggleName,
                key: toggleKey, projectKey: toggleKey)]
        1 * targetingService.createTargetingEntities(_)
        1 * environmentRepository.countByProjectKey('test_project')
        1 * dictionaryRepository.findByKey(_) >> Optional.of(new Dictionary(value: "1"))
        1 * dictionaryRepository.save(_)
        1 * publishMessageRepository.save(_)
        with(ret) {
            environmentName == it.name
            environmentKey == it.key
            serverSdkKey == it.serverSdkKey
            clientSdkKey == it.clientSdkKey
        }
    }

    def "create environment copy from exists environment"() {
        when:
        def ret = environmentService.create(projectKey,
                new EnvironmentCreateRequest(name: "copy-env", key: "copy-env", copyFrom: "exists-env"))

        then:
        1 * applicationContext.getBean(_) >> new FeatureProbe("_")
        1 * projectRepository.findByKey(projectKey) >>
                new Optional<>(new Project(name: projectName, key: projectKey))
        1 * environmentRepository.save(_) >> new Environment(name: environmentName, key: environmentKey,
                serverSdkKey: serverSdkKey, clientSdkKey: clientSdkKey, version: 1)
        1 * targetingRepository.findAllByProjectKeyAndEnvironmentKey(projectKey, _) >> [new Targeting()]
        1 * targetingService.createTargetingEntities(_)
        1 * environmentRepository.countByProjectKey('test_project')
        1 * dictionaryRepository.findByKey(_) >> Optional.of(new Dictionary(value: "1"))
        1 * dictionaryRepository.save(_)
        1 * publishMessageRepository.save(_)
        with(ret) {
            environmentName == it.name
            environmentKey == it.key
            serverSdkKey == it.serverSdkKey
            clientSdkKey == it.clientSdkKey
        }

    }

    def "update environment"() {
        when:
        def ret = environmentService.update(projectKey, environmentKey, updateRequest)
        then:
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >>
                Optional.of(new Environment(name: environmentName, key: environmentKey, version: 1))
        1 * environmentRepository.existsByProjectKeyAndName(projectKey, updateRequest.name) >> false
        1 * environmentRepository.save(_) >> new Environment(name: environmentName, key: environmentKey,
                serverSdkKey: serverSdkKey, clientSdkKey: clientSdkKey)
        with(ret) {
            environmentName == it.name
            environmentKey == it.key
            serverSdkKey == it.serverSdkKey
            clientSdkKey == it.clientSdkKey
        }
    }

    def "offline a environment"(){
        when:
        def offline = environmentService.offline(projectKey, environmentKey)
        then:
        1 * environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey,
                environmentKey, false) >> Optional.of(new Environment(key: environmentKey))
        1 * dictionaryRepository.findByKey("all_sdk_key_map") >> Optional.of(new Dictionary(value: "1"))
        1 * dictionaryRepository.save(_)
        1 * publishMessageRepository.save(_)
        1 * environmentRepository.save(_)
    }

    def "restore a environment"(){
        when:
        environmentService.restore(projectKey, environmentKey)
        then:
        1 * environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey,
                environmentKey, true) >> Optional.of(new Environment(key: environmentKey))
        1 * dictionaryRepository.findByKey("all_sdk_key_map") >> Optional.of(new Dictionary(value: "1"))
        1 * dictionaryRepository.save(_)
        1 * publishMessageRepository.save(_)
        1 * environmentRepository.save(_)
    }

    def "query a environment"() {
        when:
        def environment = environmentService.query(projectKey, environmentKey)
        then:
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "server-123", clientSdkKey: "client-123"))
        environmentKey == environment.key
        "server-123" == environment.serverSdkKey
        "client-123" == environment.clientSdkKey
    }

    def "validate include archived environment by key"() {
        when:
        includeArchivedEnvironmentService.validateIncludeArchivedEnvironment(projectKey, ValidateTypeEnum.KEY, "environmentKey")
        then:
        1 * environmentRepository.existsByProjectKeyAndKey(projectKey, "environmentKey") >> false
    }

    def "validate include archived environment by key is conflict"() {
        when:
        includeArchivedEnvironmentService.validateIncludeArchivedEnvironment(projectKey, ValidateTypeEnum.KEY, "environmentKey")
        then:
        1 * environmentRepository.existsByProjectKeyAndKey(projectKey, "environmentKey") >> true
        thrown(ResourceConflictException)
    }

    def "validate include archived environment by name"() {
        when:
        includeArchivedEnvironmentService.validateIncludeArchivedEnvironment(projectKey, ValidateTypeEnum.NAME, "environmentName")
        then:
        1 * environmentRepository.existsByProjectKeyAndName(projectKey, "environmentName") >> false
    }

    def "validate include archived environment by name is conflict"() {
        when:
        includeArchivedEnvironmentService.validateIncludeArchivedEnvironment(projectKey, ValidateTypeEnum.NAME, "environmentName")
        then:
        1 * environmentRepository.existsByProjectKeyAndName(projectKey, "environmentName") >> true
        thrown(ResourceConflictException)
    }

    def "environment list is archived"() {
        when:
        def list = environmentService.list(projectKey, new EnvironmentQueryRequest(archived: true))
        then:
        1 * environmentRepository.findAllByProjectKeyAndArchivedOrderByCreatedTimeAsc(projectKey, true) >> [new Environment()]
        1 == list.size()
    }

    private setAuthContext(String account, String role) {
        SecurityContextHolder.setContext(new SecurityContextImpl(
                new JwtAuthenticationToken(new Jwt.Builder("21212").header("a", "a")
                        .claim("role", role).claim("account", account).build())))
    }
}

