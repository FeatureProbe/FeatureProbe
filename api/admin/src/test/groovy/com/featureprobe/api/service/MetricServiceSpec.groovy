package com.featureprobe.api.service

import com.featureprobe.api.base.enums.MetricTypeEnum
import com.featureprobe.api.base.enums.MatcherTypeEnum
import com.featureprobe.api.config.AppConfig
import com.featureprobe.api.dao.entity.Environment
import com.featureprobe.api.dao.entity.Event
import com.featureprobe.api.dao.entity.Metric
import com.featureprobe.api.dao.exception.ResourceNotFoundException
import com.featureprobe.api.dao.repository.DictionaryRepository
import com.featureprobe.api.dao.repository.EnvironmentRepository
import com.featureprobe.api.dao.repository.EventRepository
import com.featureprobe.api.dao.repository.MetricRepository
import com.featureprobe.api.dao.repository.PublishMessageRepository
import com.featureprobe.api.dao.repository.ToggleControlConfRepository
import com.featureprobe.api.dto.MetricCreateRequest
import org.hibernate.internal.SessionImpl
import spock.lang.Specification
import javax.persistence.EntityManager

class MetricServiceSpec extends Specification {

    EventRepository eventRepository

    MetricRepository metricRepository

    EntityManager entityManager

    MetricService eventService

    PublishMessageRepository publishMessageRepository

    EnvironmentRepository environmentRepository

    DictionaryRepository dictionaryRepository

    ToggleControlConfRepository toggleControlConfRepository

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
        changeLogService = new ChangeLogService(publishMessageRepository, environmentRepository, dictionaryRepository)
        eventService = new MetricService(eventRepository, metricRepository, toggleControlConfRepository, environmentRepository, changeLogService, appConfig, entityManager)
        projectKey = "Test_Project"
        environmentKey = "online"
        toggleKey = "Test_Toggle"
    }

    def "create a new CONVERSION metric"() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(name: "Test Metric", description: "desc", type: MetricTypeEnum.CONVERSION, eventName: "access_feature")
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
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
        MetricCreateRequest request = new MetricCreateRequest(type: MetricTypeEnum.CLICK, url: "http://127.0.0.1/test", matcher: MatcherTypeEnum.SIMPLE, selector: "#123")
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        1 * metricRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.empty()
        2 * eventRepository.findByName(_) >> Optional.empty()
        1 * eventRepository.save(_) >> new Event(name: "123")
        1 * eventRepository.save(_) >> new Event(name: "321")
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(version: 1))
        1 * environmentRepository.save(_)
        1 * publishMessageRepository.save(_)
        1 * metricRepository.save(_) >> new Metric(type: MetricTypeEnum.CLICK, events: new TreeSet<Event>([new Event(name: "123"), new Event(name: "321")]))
        MetricTypeEnum.CLICK.name() == created.type.name()
        2 == created.events.size()
    }

    def "update a exists event "() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(name: "Test Metric", description: "desc", type: MetricTypeEnum.CONVERSION, eventName: "access_feature2")
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        1 * metricRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.of(new Metric(type: MetricTypeEnum.NUMERIC, events: [new Event(name: "access_feature2")]))
        1 * eventRepository.findByName("access_feature2") >> Optional.of(new Event(id: 1, name: "access_feature2"))
        1 * eventRepository.save(_) >> new Event(name: "access_feature2")
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(version: 1))
        1 * environmentRepository.save(_)
        1 * publishMessageRepository.save(_)
        1 * metricRepository.save(_) >> new Metric(type: MetricTypeEnum.NUMERIC, events: [new Event(name: "access_feature2")])
        MetricTypeEnum.NUMERIC.name() == created.type.name()
        1 == created.events.size()
    }


    def "create a CONVERSION event: name is required"() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(type: MetricTypeEnum.CONVERSION)
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        thrown(IllegalArgumentException)
    }

    def "create a PAGE_VIEW event: url is required"() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(type: MetricTypeEnum.PAGE_VIEW)
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        thrown(IllegalArgumentException)
    }

    def "create a CLICK event: selector is required"() {
        given:
        MetricCreateRequest request = new MetricCreateRequest(type: MetricTypeEnum.CLICK, matcher: MatcherTypeEnum.SIMPLE, url: "https://127.0.0.1/test")
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        thrown(IllegalArgumentException)
    }


    def "query a event by toggle"() {
        when:
        def metric = eventService.query(projectKey, environmentKey, toggleKey)
        then:
        1 * metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.of(new Metric(type: MetricTypeEnum.CONVERSION, events: [new Event(name: "access_feature")]))
        MetricTypeEnum.CONVERSION.name() == metric.type.name()
        "access_feature" == metric.eventName
    }

    def "query a not exists event by toggle"() {
        when:
        eventService.query(projectKey, environmentKey, toggleKey)
        then:
        1 * metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >> Optional.empty()
        thrown(ResourceNotFoundException)
    }
}