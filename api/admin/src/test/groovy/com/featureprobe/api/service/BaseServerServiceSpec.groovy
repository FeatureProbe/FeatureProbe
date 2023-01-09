package com.featureprobe.api.service


import com.featureprobe.api.dao.entity.*
import com.featureprobe.api.dao.repository.*
import org.hibernate.internal.SessionImpl
import spock.lang.Specification

import javax.persistence.EntityManager

class BaseServerServiceSpec extends Specification {

    EnvironmentRepository environmentRepository
    SegmentRepository segmentRepository
    ToggleRepository toggleRepository
    TargetingRepository targetingRepository
    DictionaryRepository dictionaryRepository
    EntityManager entityManager
    BaseServerService baseServerService

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
        baseServerService = new BaseServerService(environmentRepository, segmentRepository, toggleRepository,
                targetingRepository, dictionaryRepository, entityManager)
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

    def "query all sdkKeys"() {
        when:
        def keys = baseServerService.queryAllSdkKeys()
        then:
        1 * environmentRepository.findAllByArchivedAndDeleted(false, false) >> [new Environment(clientSdkKey: "client-123", serverSdkKey: "server-123", version: 1)]
        1 * dictionaryRepository.findByKey(_) >> Optional.of(new Dictionary(value: "1"))
        1 == keys.clientKeyToServerKey.size()
    }


    def "query server toggles by server sdkKey"() {
        when:
        def serverResponse = baseServerService.queryServerTogglesByServerSdkKey(sdkKey)

        then:
        1 * environmentRepository.findByServerSdkKeyOrClientSdkKey(_, _) >>
                Optional.of(new Environment(project: new Project(key: projectKey, organizationId: 1), key: environmentKey, serverSdkKey: sdkKey, version: 1))
        2 * environmentRepository.findByServerSdkKey(sdkKey) >>
                Optional.of(new Environment(project: new Project(key: projectKey, organizationId: 1), key: environmentKey, organizationId: 1, version: 1))
        2 * segmentRepository.findAllByProjectKeyAndOrganizationIdAndDeleted(projectKey, 1, false) >>
                [new Segment(projectKey: projectKey, key: "test_segment",
                        uniqueKey: projectKey + "\$test_segment", rules: segmentRules)]
        1 * toggleRepository.findAllByProjectKeyAndOrganizationIdAndArchivedAndDeleted(projectKey, 1, false, false) >>
                [new Toggle(projectKey: projectKey, key: toggleKey, returnType: "string", clientAvailability: false)]
        1 * targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndOrganizationIdAndDeleted(projectKey, environmentKey, 1, false) >>
                [new Targeting(projectKey: projectKey, environmentKey: environmentKey,
                        toggleKey: toggleKey, content: rules, disabled: false)]
        with(serverResponse) {
            1 == toggles.size()
            1 == segments.size()
        }
    }

}
