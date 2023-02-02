package com.featureprobe.api.service

import com.featureprobe.api.base.enums.EventTypeEnum
import com.featureprobe.api.base.enums.MatcherTypeEnum
import com.featureprobe.api.dao.entity.Event
import com.featureprobe.api.dao.entity.TargetingEvent
import com.featureprobe.api.dao.exception.ResourceNotFoundException
import com.featureprobe.api.dao.repository.EventRepository
import com.featureprobe.api.dao.repository.TargetingEventRepository
import com.featureprobe.api.dto.EventCreateRequest
import org.hibernate.internal.SessionImpl
import spock.lang.Specification
import javax.persistence.EntityManager

class EventServiceSpec extends Specification{

    EventRepository eventRepository

    TargetingEventRepository targetingEventRepository

    EntityManager entityManager

    EventService eventService

    def projectKey
    def environmentKey
    def toggleKey

    def setup() {
        eventRepository = Mock(EventRepository)
        targetingEventRepository = Mock(TargetingEventRepository)
        entityManager = Mock(SessionImpl)
        eventService = new EventService(eventRepository, targetingEventRepository, entityManager)
        projectKey = "Test_Project"
        environmentKey = "online"
        toggleKey = "Test_Toggle"
    }

    def "create a new event"(){
        given:
        EventCreateRequest request = new EventCreateRequest(type: EventTypeEnum.CONVERSION, name: "access_feature")
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        1 * targetingEventRepository.deleteByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey)
        1 * eventRepository.findByName("access_feature") >> Optional.empty()
        1 * eventRepository.save(_) >> new Event(id: 1, type: EventTypeEnum.CONVERSION, name: "access_feature")
        1 * targetingEventRepository.save(_) >> new TargetingEvent(event: new Event(id: 1, type: EventTypeEnum.CONVERSION, name: "access_feature"))
        EventTypeEnum.CONVERSION.name() == created.type.name()
        "access_feature" == created.name
    }

    def "update a exists event "(){
        given:
        EventCreateRequest request = new EventCreateRequest(type: EventTypeEnum.CONVERSION, name: "access_feature2")
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        1 * targetingEventRepository.deleteByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey)
        1 * eventRepository.findByName("access_feature2") >> Optional.of(new Event(id: 1, type: EventTypeEnum.CONVERSION, name: "access_feature2"))
        1 * targetingEventRepository.save(_) >> new TargetingEvent(event: new Event(id: 1, type: EventTypeEnum.CONVERSION, name: "access_feature2"))
        EventTypeEnum.CONVERSION.name() == created.type.name()
        "access_feature2" == created.name
    }


    def "create a event: name is required"(){
        given:
        EventCreateRequest request = new EventCreateRequest(type: EventTypeEnum.CONVERSION)
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        thrown(IllegalArgumentException)
    }

    def "create a event error: url is required"(){
        given:
        EventCreateRequest request = new EventCreateRequest(type: EventTypeEnum.PAGE_VIEW)
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        thrown(IllegalArgumentException)
    }

    def "create a event error: selector is required"(){
        given:
        EventCreateRequest request = new EventCreateRequest(type: EventTypeEnum.CLICK, matcher: MatcherTypeEnum.SIMPLE, url: "https://127.0.0.1/test")
        when:
        def created = eventService.create(projectKey, environmentKey, toggleKey, request)
        then:
        thrown(IllegalArgumentException)
    }


    def "query a event by toggle"(){
        when:
        def indicator = eventService.query(projectKey, environmentKey, toggleKey)
        then:
        1 * targetingEventRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.of(new TargetingEvent(id: 1, event: new Event(id: 1, type: EventTypeEnum.CONVERSION, name: "access_feature")))
        EventTypeEnum.CONVERSION.name() == indicator.type.name()
        "access_feature" == indicator.name
    }

    def "query a not exists event by toggle"(){
        when:
        def indicator = eventService.query(projectKey, environmentKey, toggleKey)
        then:
        1 * targetingEventRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.empty()
        thrown(ResourceNotFoundException)
    }
}