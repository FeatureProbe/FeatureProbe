package com.featureprobe.api.service

import com.featureprobe.api.dao.entity.Environment
import com.featureprobe.api.dao.entity.Project
import com.featureprobe.api.dao.repository.EnvironmentRepository
import com.featureprobe.api.dao.repository.EventRepository
import com.featureprobe.api.dao.repository.MetricsCacheRepository
import com.featureprobe.api.dto.AccessSummary
import com.featureprobe.api.dto.EventCreateRequest
import com.featureprobe.api.dto.VariationAccessCounter
import spock.lang.Specification

class EventServiceSpec extends Specification {

    EventService eventService
    EventRepository eventRepository
    EnvironmentRepository environmentRepository
    MetricsCacheRepository metricsCacheRepository

    def setup() {
        eventRepository = Mock(EventRepository)
        environmentRepository = Mock(EnvironmentRepository)
        metricsCacheRepository = Mock(MetricsCacheRepository)
        eventService = new EventService(eventRepository, environmentRepository, metricsCacheRepository)
    }

    def "test create access events"() {
        def savedEvents

        when:
        this.eventService.create("server-key-test", "java/1.0.0", [new EventCreateRequest(access: new AccessSummary(
                startTime: 10010101010,
                endTime: 202020202020,
                counters: [
                        "key1": [new VariationAccessCounter(value: "true", count: 100),
                                 new VariationAccessCounter(value: "false", count: 10)]
                ]
        ))])

        then:
        1 * environmentRepository.findByServerSdkKey("server-key-test") >>
                Optional.of(new Environment(name: "test", project: new Project(key: "test_prj")))
        1 * eventRepository.saveAll(_) >> { it -> savedEvents = it[0] }
        savedEvents
        2 == savedEvents.size()

        with(savedEvents[0]) {
            "access" == it.type
        }
    }

}
