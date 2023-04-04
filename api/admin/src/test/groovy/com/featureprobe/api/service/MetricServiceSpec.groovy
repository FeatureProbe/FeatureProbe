package com.featureprobe.api.service

import com.featureprobe.api.base.enums.AlgorithmDenominatorEnum
import com.featureprobe.api.base.enums.EventTypeEnum
import com.featureprobe.api.base.enums.MetricTypeEnum
import com.featureprobe.api.base.enums.MatcherTypeEnum
import com.featureprobe.api.base.enums.SDKType
import com.featureprobe.api.config.AppConfig
import com.featureprobe.api.dao.entity.Environment
import com.featureprobe.api.dao.entity.Event
import com.featureprobe.api.dao.entity.Metric
import com.featureprobe.api.dao.entity.MetricIteration
import com.featureprobe.api.dao.entity.TargetingVersion
import com.featureprobe.api.dao.exception.ResourceNotFoundException
import com.featureprobe.api.dao.repository.DictionaryRepository
import com.featureprobe.api.dao.repository.EnvironmentRepository
import com.featureprobe.api.dao.repository.EventRepository
import com.featureprobe.api.dao.repository.MetricIterationRepository
import com.featureprobe.api.dao.repository.MetricRepository
import com.featureprobe.api.dao.repository.PublishMessageRepository
import com.featureprobe.api.dao.repository.TargetingVersionRepository
import com.featureprobe.api.dao.repository.ToggleControlConfRepository
import com.featureprobe.api.dto.MetricCreateRequest
import org.hibernate.internal.SessionImpl
import spock.lang.Specification
import spock.lang.Unroll

import javax.persistence.EntityManager

class MetricServiceSpec extends Specification {

    EventRepository eventRepository

    MetricRepository metricRepository

    EntityManager entityManager

    MetricService metricService

    PublishMessageRepository publishMessageRepository

    EnvironmentRepository environmentRepository

    DictionaryRepository dictionaryRepository

    ToggleControlConfRepository toggleControlConfRepository

    MetricIterationRepository metricIterationRepository

    TargetingVersionRepository targetingVersionRepository

    ChangeLogService changeLogService

    AppConfig appConfig

    def projectKey
    def environmentKey
    def toggleKey

    def setup() {
        eventRepository = Mock(EventRepository)
        metricRepository = Mock(MetricRepository)
        entityManager = Mock(SessionImpl)
        publishMessageRepository = Mock(PublishMessageRepository)
        environmentRepository = Mock(EnvironmentRepository)
        dictionaryRepository = Mock(DictionaryRepository)
        toggleControlConfRepository = Mock(ToggleControlConfRepository)
        metricIterationRepository = Mock(MetricIterationRepository)
        targetingVersionRepository = Mock(TargetingVersionRepository)
        changeLogService = new ChangeLogService(publishMessageRepository, environmentRepository, dictionaryRepository)
        metricService = new MetricService(eventRepository, metricRepository, toggleControlConfRepository,
                environmentRepository, metricIterationRepository, targetingVersionRepository, changeLogService, appConfig, entityManager)
        projectKey = "Test_Project"
        environmentKey = "online"
        toggleKey = "Test_Toggle"
    }

    def "create a new CONVERSION metric"() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(name: "Test Metric", description: "desc",
                metricType: MetricTypeEnum.CONVERSION, eventType: EventTypeEnum.CUSTOM, eventName: "access_feature",
                denominator: AlgorithmDenominatorEnum.TOTAL_SAMPLE)
        when:
        def created = metricService.create(projectKey, environmentKey, toggleKey, request)
        then:
        1 * metricRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.empty()
        1 * eventRepository.findByName("access_feature") >> Optional.empty()
        1 * eventRepository.save(_) >> new Event(name: "access_feature")
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(version: 1))
        1 * environmentRepository.save(_)
        1 * publishMessageRepository.save(_)
        1 * metricRepository.save(_) >> new Metric(type: MetricTypeEnum.CONVERSION, events: [new Event(name: "access_feature")])
        MetricTypeEnum.CONVERSION.name() == created.type.name()
        1 == created.events.size()
    }

    def "create a new CLICK metric"() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(name: "Test Metric", description: "desc", metricType: MetricTypeEnum.CONVERSION,
                eventType: EventTypeEnum.CLICK, url: "http://127.0.0.1/test", matcher: MatcherTypeEnum.SIMPLE, selector: "#123",
                denominator: AlgorithmDenominatorEnum.TOTAL_SAMPLE)
        when:
        def created = metricService.create(projectKey, environmentKey, toggleKey, request)
        then:
        1 * metricRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.empty()
        2 * eventRepository.findByName(_) >> Optional.empty()
        1 * eventRepository.save(_) >> new Event(name: "123")
        1 * eventRepository.save(_) >> new Event(name: "321")
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(version: 1))
        1 * environmentRepository.save(_)
        1 * publishMessageRepository.save(_)
        1 * metricRepository.save(_) >> new Metric(type: MetricTypeEnum.CONVERSION,
                events: new TreeSet<Event>([new Event(type: EventTypeEnum.CLICK, name: "123"), new Event(type: EventTypeEnum.PAGE_VIEW, name: "321")]))
        MetricTypeEnum.CONVERSION.name() == created.type.name()
        2 == created.events.size()
    }

    def "update a exists event "() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(name: "Test Metric", description: "desc",
                metricType: MetricTypeEnum.CONVERSION, eventType: EventTypeEnum.CUSTOM, eventName: "access_feature2", denominator: AlgorithmDenominatorEnum.TOTAL_SAMPLE)
        when:
        def created = metricService.create(projectKey, environmentKey, toggleKey, request)
        then:
        1 * metricRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.of(new Metric(type: MetricTypeEnum.CONVERSION, events: [new Event(name: "access_feature2")]))
        1 * eventRepository.findByName("access_feature2") >> Optional.of(new Event(id: 1, type: EventTypeEnum.CUSTOM, name: "access_feature2"))
        1 * eventRepository.save(_) >> new Event(name: "access_feature2")
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(version: 1))
        1 * environmentRepository.save(_)
        1 * publishMessageRepository.save(_)
        1 * metricRepository.save(_) >> new Metric(type: MetricTypeEnum.CONVERSION, events: [new Event(id: 1, type: EventTypeEnum.CUSTOM, name: "access_feature2")])
        MetricTypeEnum.CONVERSION.name() == created.type.name()
        1 == created.events.size()
    }

    def "query a not exists event by toggle"() {
        when:
        metricService.query(projectKey, environmentKey, toggleKey)
        then:
        1 * metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.empty()
        thrown(ResourceNotFoundException)
    }

    def "query metric iteration"() {
        when:
        def iteration = metricService.iteration(projectKey, environmentKey, toggleKey)
        then:
        1 * metricIterationRepository.findAllByProjectKeyAndEnvironmentKeyAndToggleKeyOrderByStartAsc(projectKey, environmentKey,
                        toggleKey) >> [new MetricIteration(start: new Date(System.currentTimeMillis()), stop: new Date(System.currentTimeMillis() + (24 * 60 * 60 * 1000)))]
        1 * targetingVersionRepository
                .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndCreatedTimeGreaterThanEqualOrderByVersionDesc(
                        projectKey, environmentKey, toggleKey, _) >> [new TargetingVersion(version: 1, createdTime: new Date(), comment: "Release 1")]
        1 == iteration.size()
        1 == iteration.get(0).records.size()
    }


    @Unroll
    def "buildExistsEventURLQuery should return correct query #sdkType"() {
        given:
        def metricName = "myMetric"

        when:
        def result = metricService.buildExistsEventURLQuery(sdkType, metricName)

        then:
        result == expectedQuery

        where:
        sdkType       | expectedQuery
        null          | "metric=myMetric"
        SDKType.Java  | "metric=myMetric&sdkType=Java"
        SDKType.React | "metric=myMetric&sdkType=REACT"
    }

    def "parseExistsEventResponse returns expected result for given response"() {
        expect:
        metricService.parseExistsEventResponse(response) == expected

        where:
        response                                || expected
        '{"exists": true}'                      || true
        '{"exists": false}'                     || false
        '{"exists": "invalid_value"}'           || false
        '{"invalid_property": "invalid_value"}' || false
        '{}'                                    || false
    }
}