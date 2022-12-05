package com.featureprobe.api.service

import com.featureprobe.api.base.cache.ICache
import com.featureprobe.api.base.cache.MemoryCache
import com.featureprobe.api.base.enums.ChangeLogType
import com.featureprobe.api.base.util.JsonMapper
import com.featureprobe.api.dao.entity.PublishMessage
import com.featureprobe.api.dao.entity.Dictionary
import com.featureprobe.api.dao.entity.Environment
import com.featureprobe.api.dao.entity.Project
import com.featureprobe.api.dao.entity.ServerSegmentEntity
import com.featureprobe.api.dao.entity.ServerToggleEntity
import com.featureprobe.api.dao.entity.Targeting
import com.featureprobe.api.dao.repository.PublishMessageRepository
import com.featureprobe.api.dao.repository.DictionaryRepository
import com.featureprobe.api.dao.repository.EnvironmentRepository
import com.featureprobe.api.dao.repository.SegmentRepository
import com.featureprobe.api.dao.repository.TargetingRepository
import com.featureprobe.api.dao.repository.ToggleRepository
import com.featureprobe.api.dto.SdkKeyResponse
import com.featureprobe.api.dto.ServerResponse
import com.featureprobe.api.server.AbstractCacheServerDataSource
import com.featureprobe.api.server.CacheServerDataSource
import com.featureprobe.sdk.server.model.Segment
import com.featureprobe.sdk.server.model.Toggle
import org.hibernate.internal.SessionImpl
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import javax.persistence.EntityManager


class CacheServerDataSourceSpec extends Specification {

    EnvironmentRepository environmentRepository
    SegmentRepository segmentRepository
    ToggleRepository toggleRepository
    TargetingRepository targetingRepository
    DictionaryRepository dictionaryRepository
    EntityManager entityManager

    ICache<String, byte[]> cache

    PublishMessageRepository publishMessageRepository

    BaseServerService baseServerService

    CacheServerDataSource cacheServerDataSource

    ServerToggleEntity serverToggle

    ServerSegmentEntity serverSegment

    List<ServerToggleEntity> serverToggleList
    List<ServerSegmentEntity> serverSegmentList

    def projectKey
    def environmentKey
    def toggleKey
    def toggleName
    def sdkKey
    def rules
    def segmentRules

    def setup() {
        environmentRepository = Mock(EnvironmentRepository)
        segmentRepository = Mock(SegmentRepository)
        toggleRepository = Mock(ToggleRepository)
        targetingRepository = Mock(TargetingRepository)
        dictionaryRepository = Mock(DictionaryRepository)
        entityManager = Mock(SessionImpl)
        cache = Mock(MemoryCache)
        publishMessageRepository = Mock(PublishMessageRepository)
        baseServerService = new BaseServerService(environmentRepository, segmentRepository, toggleRepository,
                targetingRepository, dictionaryRepository, entityManager)
        cacheServerDataSource = new CacheServerDataSource(cache, publishMessageRepository, baseServerService)
        serverToggle = Mock(ServerToggleEntity)
        serverSegment = Mock(ServerSegmentEntity)
        serverToggleList = [serverToggle]
        serverSegmentList = [serverSegment]

        projectKey = "feature_probe"
        environmentKey = "test"
        toggleKey = "feature_toggle_unit_test"
        toggleName = "test_toggle"
        sdkKey = "server-123456"
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
    }


    def "query All Sdk Keys Cache" () {
        when:
        def sdkKeyResponse = cacheServerDataSource.queryAllSdkKeys()
        then:
        1 * cache.get(AbstractCacheServerDataSource.SDK_KEYS_CACHE_KEY) >> JsonMapper.toJSONString(
                new SdkKeyResponse(version: 1, clientKeyToServerKey: ["client-123" : "server-123", "client-234": "server-234"])).getBytes()
        1 == sdkKeyResponse.version
        2 == sdkKeyResponse.clientKeyToServerKey.size()
    }

    def "query Server Toggles By ServerSdkKey Cache" () {
        given:
        def serverSdkKey = "server-123"
        when:
        def serverResponse = cacheServerDataSource.queryServerTogglesByServerSdkKey(serverSdkKey)
        then:
        1 * cache.get(serverSdkKey) >> JsonMapper.toJSONString(new ServerResponse([new Toggle( key: "toggle")],
                [new Segment(uniqueId: "1", version: 1, rules: [])], 1)).getBytes()
        1 == serverResponse.version
        1 == serverResponse.toggles.size()
        1 == serverResponse.segments.size()
    }


    def "init cache" () {
        when:
        cacheServerDataSource.init()
        then:
        1 * publishMessageRepository.findAll(_) >> new PageImpl<>([new PublishMessage(id: 2, type: ChangeLogType.ADD, serverSdkKey: "server-123")], Pageable.ofSize(1), 1)
        1 * cache.put(CacheServerDataSource.MAX_CHANGE_LOG_ID_CACHE_KEY, _)
        1 * environmentRepository.findAllByArchivedAndDeleted(false, false) >> [new Environment(clientSdkKey: "client-123", serverSdkKey: "server-123", version: 1)]
        1 * dictionaryRepository.findByKey(_) >> Optional.of(new Dictionary(value: "1"))
        1 * cache.put(CacheServerDataSource.SDK_KEYS_CACHE_KEY, _)
        1 * environmentRepository.findAllServerToggle() >> serverToggleList
        1 * environmentRepository.findAllServerSegment() >> serverSegmentList
        1 * cache.putAll(_)
        serverToggle.getProjectKey() >> "projectKey"
        serverToggle.getToggleKey() >> "toggleKey"
        serverToggle.getReturnType() >> "string"
        serverToggle.getClientAvailability() >> false
        serverToggle.getTargetingDisabled() >> false
        serverToggle.getTargetingVersion() >> 1
        serverToggle.getTargetingContent() >> rules
        serverToggle.getOrganizationId() >> 1
        serverToggle.getEnvKey() >> "EnvKey"
        serverSegment.getSegmentUniqueKey() >> "unique"
        serverSegment.getSegmentVersion() >> 1
        serverSegment.getSegmentRules() >> segmentRules
        serverSegment.getSegmentKey() >> "test_segment"
        serverSegment.getProjectKey() >> "projectKey"
        serverSegment.getOrganizationId() >> 1
    }

    def "handle change log" () {
        when:
        cacheServerDataSource.handleChangeLog()
        then:
        1 * cache.get(CacheServerDataSource.MAX_CHANGE_LOG_ID_CACHE_KEY) >> JsonMapper.toJSONString(new PublishMessage(id: 2, type: ChangeLogType.ADD, serverSdkKey: "server-222"),).getBytes()
        1 * publishMessageRepository.findAllByIdGreaterThanOrderByIdAsc(2L) >>
                [new PublishMessage(id: 3, type: ChangeLogType.ADD, serverSdkKey: "server-333"),
                 new PublishMessage(id: 4, type: ChangeLogType.CHANGE, serverSdkKey: "server-444"),
                 new PublishMessage(id: 5, type: ChangeLogType.DELETE, serverSdkKey: "server-555")]
        1 * cache.put(CacheServerDataSource.SDK_KEYS_CACHE_KEY, _);
        1 * environmentRepository.findAllByArchivedAndDeleted(false, false) >> [new Environment(clientSdkKey: "client-123", serverSdkKey: "server-123", version: 1)]
        1 * dictionaryRepository.findByKey(_) >> Optional.of(new Dictionary(value: "1"))
        2 * environmentRepository.findByServerSdkKeyOrClientSdkKey(_, _) >>
                Optional.of(new Environment(project: new Project(key: projectKey, organizationId: 1), key: environmentKey, serverSdkKey: sdkKey, version: 1))
        4 * environmentRepository.findByServerSdkKey(_) >>
                Optional.of(new Environment(project: new Project(key: projectKey, organizationId: 1), key: environmentKey, organizationId: 1, version: 1))
        4 * segmentRepository.findAllByProjectKeyAndOrganizationIdAndDeleted(projectKey, 1, false) >>
                [new com.featureprobe.api.dao.entity.Segment(projectKey: projectKey, key: "test_segment",
                        uniqueKey: projectKey + "\$test_segment", rules: segmentRules)]
        2 * toggleRepository.findAllByProjectKeyAndOrganizationIdAndArchivedAndDeleted(projectKey, 1, false, false) >>
                [new com.featureprobe.api.dao.entity.Toggle(projectKey: projectKey, key: toggleKey, returnType: "string", clientAvailability: false)]
        2 * targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndOrganizationIdAndDeleted(projectKey, environmentKey, 1, false) >>
                [new Targeting(projectKey: projectKey, environmentKey: environmentKey,
                        toggleKey: toggleKey, content: rules, disabled: false)]
        1 * cache.put("server-333", _)
        1 * cache.put("server-444", _)
        1 * cache.invalidate("server-555")
    }
}

