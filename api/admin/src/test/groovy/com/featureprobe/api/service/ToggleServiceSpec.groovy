package com.featureprobe.api.service


import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum
import com.featureprobe.api.component.SpringBeanManager
import com.featureprobe.api.config.AppConfig
import com.featureprobe.api.base.enums.SketchStatusEnum
import com.featureprobe.api.base.enums.ValidateTypeEnum
import com.featureprobe.api.base.enums.VisitFilter
import com.featureprobe.api.dao.entity.TargetingVersion
import com.featureprobe.api.dao.exception.ResourceConflictException
import com.featureprobe.api.dao.repository.*
import com.featureprobe.api.dto.ToggleCreateRequest
import com.featureprobe.api.dto.ToggleSearchRequest
import com.featureprobe.api.dto.ToggleUpdateRequest
import com.featureprobe.api.dao.entity.Environment
import com.featureprobe.api.dao.entity.Member
import com.featureprobe.api.dao.entity.TrafficCache
import com.featureprobe.api.dao.entity.Project
import com.featureprobe.api.dao.entity.Tag
import com.featureprobe.api.dao.entity.Targeting
import com.featureprobe.api.dao.entity.TargetingSketch
import com.featureprobe.api.dao.entity.Toggle
import com.featureprobe.api.dao.entity.ToggleTagRelation
import com.featureprobe.sdk.server.FeatureProbe
import org.hibernate.internal.SessionImpl
import org.springframework.context.ApplicationContext
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import spock.lang.Specification
import spock.lang.Title

import javax.persistence.EntityManager

@Title("Toggle Unit Test")
class ToggleServiceSpec extends Specification {

    ToggleService toggleService

    AppConfig appConfig

    ToggleRepository toggleRepository

    TagRepository tagRepository

    ToggleTagRepository toggleTagRepository

    TargetingRepository targetingRepository

    EnvironmentRepository environmentRepository

    TrafficRepository trafficRepository

    TargetingService targetingService

    TargetingSketchRepository targetingSketchRepository

    TrafficCacheRepository trafficCacheRepository

    ChangeLogService changeLogService

    ProjectRepository projectRepository

    EntityManager entityManager

    IncludeArchivedToggleService includeArchivedToggleService

    PublishMessageRepository publishMessageRepository

    DictionaryRepository dictionaryRepository

    TargetingVersionRepository targetingVersionRepository

    Set<String> toggleKeys = new HashSet()

    ApplicationContext applicationContext

    def projectKey
    def environmentKey
    def toggleKey
    def toggleName
    def sdkKey
    def rules
    def segmentRules

    def setup() {
        toggleRepository = Mock(ToggleRepository)
        tagRepository = Mock(TagRepository)
        appConfig = new AppConfig(toggleDeadline: 30, serverDataSource: "cache", serverBaseUrls: "http://127.0.0.1:4007")
        toggleTagRepository = Mock(ToggleTagRepository)
        targetingRepository = Mock(TargetingRepository)
        environmentRepository = Mock(EnvironmentRepository)
        trafficRepository = Mock(TrafficRepository)
        targetingSketchRepository = Mock(TargetingSketchRepository)
        trafficCacheRepository = Mock(TrafficCacheRepository)
        targetingService = Mock(TargetingService)
        toggleTagRepository = Mock(ToggleTagRepository)
        targetingVersionRepository = Mock(TargetingVersionRepository)
        projectRepository = Mock(ProjectRepository)
        publishMessageRepository = Mock(PublishMessageRepository)
        dictionaryRepository = Mock(DictionaryRepository)

        changeLogService = new ChangeLogService(publishMessageRepository, environmentRepository, dictionaryRepository)
        entityManager = Mock(SessionImpl)
        toggleService = new ToggleService(appConfig, toggleRepository, tagRepository, targetingRepository,
                environmentRepository, trafficRepository, targetingSketchRepository, trafficCacheRepository,
                toggleTagRepository, changeLogService, projectRepository, targetingService, targetingVersionRepository, entityManager)
        includeArchivedToggleService = new IncludeArchivedToggleService(toggleRepository, entityManager)
        projectKey = "feature_probe"
        environmentKey = "test"
        toggleKey = "feature_toggle_unit_test"
        toggleName = "test_toggle"
        sdkKey = "server-123456"
        toggleKeys.add(toggleKey)
        rules = "{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"city\",\"predicate\":\"is one of\"," +
                "\"objects\":[\"Paris\"]},{\"type\":\"segment\",\"subject\":\"\",\"predicate\":\"is in\"," +
                "\"objects\":[\"test_segment\"]},{\"type\":\"number\",\"subject\":\"age\",\"predicate\":\"=\"," +
                "\"objects\":[\"20\"]},{\"type\":\"datetime\",\"subject\":\"\",\"predicate\":\"before\"," +
                "\"objects\":[\"2022-06-27T16:08:10+08:00\"]},{\"type\":\"semver\",\"subject\":\"\"," +
                "\"predicate\":\"before\",\"objects\":[\"1.0.1\"]}],\"name\":\"Paris women show 50% red buttons, 50% blue\"," +
                "\"serve\":{\"split\":[5000,5000,0]}}],\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1}," +
                "\"variations\":[{\"value\":\"red\",\"name\":\"Red Button\",\"description\":\"Set button color to Red\"}," +
                "{\"value\":\"blue\",\"name\":\"Blue Button\",\"description\":\"Set button color to Blue\"}]}"
        segmentRules = "[{\"conditions\":[{\"type\":\"string\",\"subject\":\"userId\",\"predicate\":\"is one of\"," +
                "\"objects\":[\"zhangsan\",\"wangwu\",\"lishi\",\"miss\"]},{\"type\":\"string\",\"subject\":\"userId\"," +
                "\"predicate\":\"is one of\",\"objects\":[\"huahau\",\"kaka\",\"dada\"]}],\"name\":\"\"}]"
        setAuthContext("Admin", "ADMIN")

        applicationContext = Mock(ApplicationContext)
        SpringBeanManager.applicationContext = applicationContext
    }

    def "query toggle by key"() {
        when:
        def ret = toggleService.queryByKey(projectKey, toggleKey)

        then:
        1 * toggleRepository.findByProjectKeyAndKey(projectKey, toggleKey) >> Optional.of(new Toggle(key: toggleKey, projectKey: projectKey, createdTime: new Date()))
        with(ret) {
            toggleKey == it.key
        }
    }

    def "offline a toggle in all environment"() {
        when:
        toggleService.offline(projectKey, toggleKey)
        then:
        1 * projectRepository.findByKey(projectKey) >>
                Optional.of(new Project(key: projectKey, environments: [new Environment(key: environmentKey, version: 1)]))
        1 * toggleRepository.findByProjectKeyAndKeyAndArchived(projectKey, toggleKey, false) >> Optional.of(new Toggle(key: toggleKey))
        1 * publishMessageRepository.save(_)
        1 * toggleRepository.save(_) >> new Toggle(variations: "[]", permanent: true, createdTime: new Date())
    }

    def "restore a toggle in all environment"() {
        when:
        toggleService.restore(projectKey, toggleKey)
        then:
        1 * projectRepository.findByKey(projectKey) >>
                Optional.of(new Project(key: projectKey, environments: [new Environment(key: environmentKey, version: 1)]))
        1 * toggleRepository.findByProjectKeyAndKeyAndArchived(projectKey, toggleKey, true) >> Optional.of(new Toggle(key: toggleKey))
        1 * publishMessageRepository.save(_)
        1 * toggleRepository.save(_) >> new Toggle(variations: "[]", permanent: true, createdTime: new Date())
    }

    def "search toggles by filter params by IN_WEEK_VISITED"() {
        def toggleSearchRequest =
                new ToggleSearchRequest(visitFilter: VisitFilter.IN_WEEK_VISITED, disabled: false,
                        tags: ["test"], keyword: "test", environmentKey: environmentKey)
        when:
        def page = toggleService.list(projectKey, toggleSearchRequest)

        then:
        1 * environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey, environmentKey, false) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "1234", clientSdkKey: "5678"))
        1 * targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndDisabled(projectKey, environmentKey,
                false) >> [new Targeting(toggleKey: toggleKey)]
        1 * tagRepository.findByNameIn(["test"]) >> [new Tag(name: "test")]
        1 * toggleTagRepository.findByTagIdIn(_) >> [new ToggleTagRelation(toggleKey: toggleKey)]
        1 * trafficRepository.findAllAccessedToggleKeyGreaterThanOrEqualToEndDate(_, _, _) >> toggleKeys
        1 * toggleRepository.findAll(_, _) >> new PageImpl<>([new Toggle(key: toggleKey, projectKey: projectKey, createdTime: new Date())],
                Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(projectKey, environmentKey, new HashSet<String>([toggleKey])) >>
                [new Targeting(toggleKey: toggleKey, environmentKey: environmentKey, projectKey: projectKey, disabled: true)]
        1 * targetingSketchRepository.findByProjectKeyAndEnvironmentKeyAndStatusAndToggleKeyIn(projectKey, environmentKey,
                SketchStatusEnum.PENDING, new HashSet<String>([toggleKey])) >> [new TargetingSketch(projectKey: projectKey, environmentKey: environmentKey, toggleKey: toggleKey,
                content: rules, disabled: false, oldVersion: 1, status: SketchStatusEnum.PENDING, createdBy: new Member(account: "Admin"))]
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "123", clientSdkKey: "123"))
        1 * trafficCacheRepository.findAll(_) >> [new TrafficCache(toggleKey: toggleKey, sdkKey: "123", startDate: new Date())]
        1 * toggleTagRepository.findByToggleKeyIn(_) >> [new ToggleTagRelation(tagId: 1, toggleKey: toggleKey)]
        1 * tagRepository.findAllById(_) >> [new Tag(name: "tagName", id: 1)]
        with(page) {
            1 == it.size
            null != it.getContent().get(0).visitedTime
            true == it.getContent().get(0).isLocked()
        }
    }

    def "search toggles by filter params by OUT_WEEK_VISITED"() {
        def toggleSearchRequest =
                new ToggleSearchRequest(visitFilter: VisitFilter.OUT_WEEK_VISITED, disabled: false,
                        tags: ["test"], keyword: "test", environmentKey: environmentKey)
        when:
        def page = toggleService.list(projectKey, toggleSearchRequest)

        then:
        1 * environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey, environmentKey, false) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "1234", clientSdkKey: "5678"))
        1 * targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndDisabled(projectKey, environmentKey,
                false) >> [new Targeting(toggleKey: toggleKey)]
        1 * tagRepository.findByNameIn(["test"]) >> [new Tag(name: "test")]
        1 * toggleTagRepository.findByTagIdIn(_) >> [new ToggleTagRelation(toggleKey: toggleKey)]
        1 * trafficRepository.findAllAccessedToggleKey(_, _) >> toggleKeys
        1 * trafficRepository.findAllAccessedToggleKeyGreaterThanOrEqualToEndDate(_, _, _) >> toggleKeys
        1 * toggleRepository.findAll(_, _) >> new PageImpl<>([new Toggle(key: toggleKey, projectKey: projectKey, createdTime: new Date())],
                Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(projectKey, environmentKey, new HashSet<String>([toggleKey])) >>
                [new Targeting(toggleKey: toggleKey, environmentKey: environmentKey, projectKey: projectKey, disabled: true)]
        1 * targetingSketchRepository.findByProjectKeyAndEnvironmentKeyAndStatusAndToggleKeyIn(projectKey, environmentKey,
                SketchStatusEnum.PENDING, new HashSet<String>([toggleKey])) >> [new TargetingSketch(projectKey: projectKey, environmentKey: environmentKey, toggleKey: toggleKey,
                content: rules, disabled: false, oldVersion: 1, status: SketchStatusEnum.PENDING, createdBy: new Member(account: "Admin"))]
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "123", clientSdkKey: "123"))
        1 * trafficCacheRepository.findAll(_) >> [new TrafficCache(toggleKey: toggleKey, sdkKey: "123", startDate: new Date())]
        1 * toggleTagRepository.findByToggleKeyIn(_) >> [new ToggleTagRelation(tagId: 1, toggleKey: toggleKey)]
        1 * tagRepository.findAllById(_) >> [new Tag(name: "tagName", id: 1)]
        with(page) {
            1 == it.size
            null != it.getContent().get(0).visitedTime
            true == it.getContent().get(0).isLocked()
        }
    }

    def "search toggles by filter params by NOT_VISITED"() {
        def toggleSearchRequest =
                new ToggleSearchRequest(visitFilter: VisitFilter.NOT_VISITED, disabled: false,
                        tags: ["test"], keyword: "test", environmentKey: environmentKey)
        when:
        def page = toggleService.list(projectKey, toggleSearchRequest)

        then:
        1 * environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey, environmentKey, false) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "1234", clientSdkKey: "5678"))
        1 * targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndDisabled(projectKey, environmentKey,
                false) >> [new Targeting(toggleKey: toggleKey)]
        1 * tagRepository.findByNameIn(["test"]) >> [new Tag(name: "test")]
        1 * toggleTagRepository.findByTagIdIn(_) >> [new ToggleTagRelation(toggleKey: toggleKey)]
        1 * trafficRepository.findAllAccessedToggleKey(_, _) >> toggleKeys
        1 * toggleRepository.findAll(_) >> [new Toggle(key: toggleKey, projectKey: projectKey, createdTime: new Date())]
        1 * toggleRepository.findAll(_, _) >> new PageImpl<>([new Toggle(key: toggleKey, projectKey: projectKey, createdTime: new Date())],
                Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(projectKey, environmentKey, new HashSet<String>([toggleKey])) >>
                [new Targeting(toggleKey: toggleKey, environmentKey: environmentKey, projectKey: projectKey, disabled: true)]
        1 * targetingSketchRepository.findByProjectKeyAndEnvironmentKeyAndStatusAndToggleKeyIn(projectKey, environmentKey,
                SketchStatusEnum.PENDING, new HashSet<String>([toggleKey])) >> [new TargetingSketch(projectKey: projectKey, environmentKey: environmentKey, toggleKey: toggleKey,
                content: rules, disabled: false, oldVersion: 1, status: SketchStatusEnum.PENDING, createdBy: new Member(account: "Admin"))]
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "123", clientSdkKey: "123"))
        1 * trafficCacheRepository.findAll(_) >> [new TrafficCache(toggleKey: toggleKey, sdkKey: "123", startDate: new Date())]
        1 * toggleTagRepository.findByToggleKeyIn(_) >> [new ToggleTagRelation(tagId: 1, toggleKey: toggleKey)]
        1 * tagRepository.findAllById(_) >> [new Tag(name: "tagName", id: 1)]
        with(page) {
            1 == it.size
            null != it.getContent().get(0).visitedTime
            true == it.getContent().get(0).isLocked()
        }
    }

    def "search toggles by filter params"() {
        def toggleSearchRequest =
                new ToggleSearchRequest(visitFilter: VisitFilter.IN_WEEK_VISITED, disabled: false,
                        tags: ["test"], keyword: "test", environmentKey: environmentKey, releaseStatusList: [ToggleReleaseStatusEnum.RELEASE])
        when:
        def page = toggleService.list(projectKey, toggleSearchRequest)

        then:
        1 * environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey, environmentKey, false) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "1234", clientSdkKey: "5678"))
        1 * targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndDisabled(projectKey, environmentKey,
                false) >> [new Targeting(toggleKey: toggleKey)]
        1 * tagRepository.findByNameIn(["test"]) >> [new Tag(name: "test")]
        1 * toggleTagRepository.findByTagIdIn(_) >> [new ToggleTagRelation(toggleKey: toggleKey)]
        1 * trafficRepository.findAllAccessedToggleKeyGreaterThanOrEqualToEndDate(_, _, _) >> toggleKeys
        1 * targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndStatusIn(projectKey,
                environmentKey, [ToggleReleaseStatusEnum.RELEASE]) >> [new Targeting(toggleKey: toggleKey, environmentKey: environmentKey, projectKey: projectKey, disabled: true)]
        1 * toggleRepository.findAll(_, _) >> new PageImpl<>([new Toggle(key: toggleKey, projectKey: projectKey, createdTime: new Date())],
                Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(projectKey, environmentKey, new HashSet<String>([toggleKey])) >>
                [new Targeting(toggleKey: toggleKey, environmentKey: environmentKey, projectKey: projectKey, disabled: true)]
        1 * targetingSketchRepository.findByProjectKeyAndEnvironmentKeyAndStatusAndToggleKeyIn(projectKey, environmentKey,
                SketchStatusEnum.PENDING, new HashSet<String>([toggleKey])) >> [new TargetingSketch(projectKey: projectKey, environmentKey: environmentKey, toggleKey: toggleKey,
                content: rules, disabled: false, oldVersion: 1, status: SketchStatusEnum.PENDING, createdBy: new Member(account: "Admin"))]
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >>
                Optional.of(new Environment(key: environmentKey, serverSdkKey: "123", clientSdkKey: "123"))
        1 * trafficCacheRepository.findAll(_) >> [new TrafficCache(toggleKey: toggleKey, sdkKey: "123", startDate: new Date())]
        1 * toggleTagRepository.findByToggleKeyIn(_) >> [new ToggleTagRelation(tagId: 1, toggleKey: toggleKey)]
        1 * tagRepository.findAllById(_) >> [new Tag(name: "tagName", id: 1)]
        with(page) {
            1 == it.size
            null != it.getContent().get(0).visitedTime
            true == it.getContent().get(0).isLocked()
        }
    }

    def "query toggle keys by related to me"() {
        when:
        Set<String> toggleKeys = toggleService.queryToggleKeysByRelatedToMe(projectKey,  environmentKey)

        then:
        1 * targetingRepository.findAll(_) >>  [new Targeting(toggleKey: toggleKey, environmentKey: environmentKey, projectKey: projectKey, disabled: true)]
        1 * targetingVersionRepository.findAll(_) >>  [new TargetingVersion(toggleKey: toggleKey, environmentKey: environmentKey, projectKey: projectKey, disabled: true)]
        1 * toggleRepository.findAll(_) >> []

        1 == toggleKeys.size()
    }

    def "search toggles in project"() {
        given:
        when:
        def toggles = toggleService.list(projectKey, new ToggleSearchRequest())
        then:
        1 * toggleRepository.findAllByProjectKeyAndArchived(projectKey, false, _) >>  new PageImpl<>([new Toggle(key: toggleKey, projectKey: projectKey, createdTime: new Date())],
                Pageable.ofSize(1), 1)
        1 == toggles.content.size()
    }

    def "create toggle success"() {
        when:
        def response = toggleService.create(projectKey,
                new ToggleCreateRequest(name: "toggle1", key: toggleKey, tags: ["tg1", "tg2"]))

        then:
        response
        1 * applicationContext.getBean(_) >> new FeatureProbe("_")
        1 * toggleRepository.save(_ as Toggle) >> new Toggle(projectKey: projectKey,
                key: toggleKey, name: "toggle1", desc: "init", createdTime: new Date(), tags: [new Tag(name: "tg1"), new Tag(name: "tg2")])
        1 * tagRepository.findByProjectKeyAndNameIn(projectKey, ["tg1", "tg2"]) >> [new Tag(name: "tg1"), new Tag(name: "tg2")]
        1 * targetingService.createDefaultTargetingEntities(projectKey, _)
        1 * toggleRepository.countByProjectKey('feature_probe')

        with(response) {
            toggleKey == key
            2 == tags.size()
        }
    }

    def "update toggle success"() {
        Toggle updatedToggle

        when:
        def response = toggleService.update(projectKey, toggleKey,
                new ToggleUpdateRequest(name: "toggle2", tags: ["tg1", "tg2"], desc: "updated"))

        then:
        response
        1 * toggleRepository.findByProjectKeyAndKey(projectKey, toggleKey) >> Optional.of(new Toggle(projectKey: projectKey,
                key: toggleKey, name: "toggle1", desc: "init", createdTime: new Date()))
        1 * toggleRepository.existsByProjectKeyAndName(projectKey, "toggle2") >> false
        1 * toggleRepository.save(_ as Toggle) >> { it -> updatedToggle = it[0] }
        1 * tagRepository.findByProjectKeyAndNameIn(projectKey, ["tg1", "tg2"]) >> [new Tag(name: "tg1")]
        with(updatedToggle) {
            toggleKey == key
            "updated" == desc
            "toggle2" == name
            1 == tags.size()
        }
    }

    def "validate include archived toggle by key"() {
        when:
        includeArchivedToggleService.validateIncludeArchivedToggle(projectKey, ValidateTypeEnum.KEY, "toggleKey")
        then:
        1 * toggleRepository.existsByProjectKeyAndKey(projectKey, "toggleKey") >> false
    }

    def "validate include archived toggle by key is conflict"() {
        when:
        includeArchivedToggleService.validateIncludeArchivedToggle(projectKey, ValidateTypeEnum.KEY, "toggleKey")
        then:
        1 * toggleRepository.existsByProjectKeyAndKey(projectKey, "toggleKey") >> true
        thrown(ResourceConflictException)
    }

    def "validate include archived toggle by name"() {
        when:
        includeArchivedToggleService.validateIncludeArchivedToggle(projectKey, ValidateTypeEnum.NAME, "toggleName")
        then:
        1 * toggleRepository.existsByProjectKeyAndName(projectKey, "toggleName") >> false
    }

    def "validate include archived toggle by name is conflict"() {
        when:
        includeArchivedToggleService.validateIncludeArchivedToggle(projectKey, ValidateTypeEnum.NAME, "toggleName")
        then:
        1 * toggleRepository.existsByProjectKeyAndName(projectKey, "toggleName") >> true
        thrown(ResourceConflictException)
    }

    private setAuthContext(String account, String role) {
        SecurityContextHolder.setContext(new SecurityContextImpl(
                new JwtAuthenticationToken(new Jwt.Builder("21212").header("a", "a")
                        .claim("role", role).claim("account", account).build())))
    }
}