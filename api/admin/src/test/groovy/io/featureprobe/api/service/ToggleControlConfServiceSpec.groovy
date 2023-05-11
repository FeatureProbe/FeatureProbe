package io.featureprobe.api.service

import io.featureprobe.api.config.AppConfig
import io.featureprobe.api.dao.entity.MetricIteration
import io.featureprobe.api.dao.entity.ToggleControlConf
import io.featureprobe.api.dao.repository.EventRepository
import io.featureprobe.api.dao.repository.MetricIterationRepository
import io.featureprobe.api.dao.repository.ToggleControlConfRepository
import io.featureprobe.api.dao.entity.Targeting
import io.featureprobe.api.dao.repository.DictionaryRepository
import io.featureprobe.api.dao.repository.EnvironmentRepository
import io.featureprobe.api.dao.repository.MetricRepository
import io.featureprobe.api.dao.repository.PublishMessageRepository
import io.featureprobe.api.dao.repository.TargetingVersionRepository
import spock.lang.Specification

import javax.persistence.EntityManager


class ToggleControlConfServiceSpec extends Specification {

    ToggleControlConfService toggleControlConfService

    ToggleControlConfRepository toggleControlConfRepository

    EventRepository eventRepository;

    MetricRepository metricRepository;

    EnvironmentRepository environmentRepository;

    MetricIterationRepository metricIterationRepository;

    TargetingVersionRepository targetingVersionRepository;

    PublishMessageRepository publishMessageRepository;

    DictionaryRepository dictionaryRepository;

    ChangeLogService changeLogService;

    AppConfig appConfig;

    MetricService metricService

    EntityManager entityManager

    def setup() {
        toggleControlConfRepository = Mock(ToggleControlConfRepository)
        eventRepository = Mock(EventRepository)
        metricRepository = Mock(MetricRepository)
        environmentRepository = Mock(EnvironmentRepository)
        metricIterationRepository = Mock(MetricIterationRepository)
        targetingVersionRepository = Mock(TargetingVersionRepository)
        publishMessageRepository = Mock(PublishMessageRepository)
        dictionaryRepository = Mock(DictionaryRepository)
        changeLogService = new ChangeLogService(publishMessageRepository, environmentRepository, dictionaryRepository)
        entityManager = Mock(EntityManager)
        metricService = new MetricService(eventRepository, metricRepository, toggleControlConfRepository,
                environmentRepository, metricIterationRepository, targetingVersionRepository, changeLogService, appConfig, entityManager)
        toggleControlConfService = new ToggleControlConfService(toggleControlConfRepository, metricService, entityManager)
    }


    def 'test update track access events if conf not exists should be create'() {
        ToggleControlConf savedConf

        Targeting latestTargeting = new Targeting(projectKey: "pk", environmentKey: "ek",
                toggleKey: "tk")

        when:
        toggleControlConfService.updateTrackAccessEvents(latestTargeting, true)

        then:
        1 * toggleControlConfRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(latestTargeting.projectKey,
                latestTargeting.environmentKey, latestTargeting.toggleKey) >> Optional.empty()
        1 * toggleControlConfRepository.save(_ as ToggleControlConf) >> { savedConf = it[0] }
        with(savedConf) {
            latestTargeting.toggleKey == getToggleKey()
            latestTargeting.environmentKey == getEnvironmentKey()
            latestTargeting.projectKey == getProjectKey()
            savedConf.trackAccessEvents
            savedConf.lastModified
        }
    }


    def 'test update track access events if conf existed should be update'() {
        ToggleControlConf savedConf
        Targeting latestTargeting = new Targeting(projectKey: "pk", environmentKey: "ek", toggleKey: "tk")

        when:
        toggleControlConfService.updateTrackAccessEvents(latestTargeting, false)

        then:
        1 * toggleControlConfRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(_, _, _) >>
                Optional.of(new ToggleControlConf(trackAccessEvents: true))
        1 * toggleControlConfRepository.save(_ as ToggleControlConf) >> { savedConf = it[0] }
        1 * metricIterationRepository
                .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyOrderByStartAsc(_, _,
                        _) >> [new MetricIteration()]
        1 * metricIterationRepository.save(_) >> new MetricIteration()
        with(savedConf) {
            !savedConf.trackAccessEvents
        }
    }


    def 'test query toggle control conf'() {
        Targeting latestTargeting = new Targeting(projectKey: "pk", environmentKey: "ek", toggleKey: "tk")

        when:
        ToggleControlConf toggleControlConf = toggleControlConfService.queryToggleControlConf(latestTargeting)

        then:
        1 * toggleControlConfRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(_, _, _) >>
                Optional.of(new ToggleControlConf(trackAccessEvents: true))

        toggleControlConf
    }

}
