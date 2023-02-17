package com.featureprobe.api.service

import com.featureprobe.api.dao.entity.Targeting
import com.featureprobe.api.dao.entity.ToggleControlConf
import com.featureprobe.api.dao.repository.ToggleControlConfRepository
import spock.lang.Specification

import javax.persistence.EntityManager


class ToggleControlConfServiceSpec extends Specification {

    ToggleControlConfService toggleControlConfService

    ToggleControlConfRepository toggleControlConfRepository
    EntityManager entityManager

    def setup() {
        toggleControlConfRepository = Mock(ToggleControlConfRepository)
        entityManager = Mock(EntityManager)

        toggleControlConfService = new ToggleControlConfService(toggleControlConfRepository, entityManager)
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
