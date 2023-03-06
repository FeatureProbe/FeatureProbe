package com.featureprobe.api.service;

import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.dao.entity.ToggleControlConf;
import com.featureprobe.api.dao.repository.ToggleControlConfRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Date;

@Slf4j
@AllArgsConstructor
@Service
public class ToggleControlConfService {

    ToggleControlConfRepository toggleControlConfRepository;

    MetricService metricService;

    @PersistenceContext
    public EntityManager entityManager;

    private ToggleControlConf createDefaultByTargeting(Targeting targeting) {
        ToggleControlConf controlConf = new ToggleControlConf();
        controlConf.setProjectKey(targeting.getProjectKey());
        controlConf.setEnvironmentKey(targeting.getEnvironmentKey());
        controlConf.setToggleKey(targeting.getToggleKey());
        controlConf.setTrackAccessEvents(false);
        controlConf.setLastModified(new Date());

        return controlConf;
    }

    public ToggleControlConf queryToggleControlConf(Targeting targeting) {
        ToggleControlConf toggleControlConf = toggleControlConfRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(targeting.getProjectKey(),
                        targeting.getEnvironmentKey(), targeting.getToggleKey())
                .orElse(createDefaultByTargeting(targeting));

        return toggleControlConf;
    }

    @Transactional(rollbackFor = Exception.class)
    public ToggleControlConf updateTrackAccessEvents(Targeting latestTargeting, Boolean trackAccessEvents) {
        ToggleControlConf toggleControlConf = queryToggleControlConf(latestTargeting);
        if (trackAccessEvents != null) {
            if (toggleControlConf.isTrackAccessEvents() == trackAccessEvents.booleanValue()) {
                return toggleControlConf;
            }
            toggleControlConf.setTrackAccessEvents(trackAccessEvents);
            Date now = new Date();
            if (trackAccessEvents) {
                toggleControlConf.setTrackStartTime(now);
                toggleControlConf.setTrackEndTime(null);
            } else {
                toggleControlConf.setTrackEndTime(now);
            }
            metricService.updateMetricIteration(latestTargeting.getProjectKey(), latestTargeting.getEnvironmentKey(),
                    latestTargeting.getToggleKey(), trackAccessEvents, now);
        }
        toggleControlConf.setLastModified(new Date());
        toggleControlConfRepository.save(toggleControlConf);

        return toggleControlConf;
    }
}
