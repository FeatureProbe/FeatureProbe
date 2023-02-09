package com.featureprobe.api.service;

import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.enums.TrafficCacheTypeEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Traffic;
import com.featureprobe.api.dao.entity.TrafficCache;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.TrafficRepository;
import com.featureprobe.api.dao.repository.TrafficCacheRepository;
import com.featureprobe.api.dto.TrafficCreateRequest;
import com.featureprobe.api.dto.VariationAccessCounterRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
@ExcludeTenant
public class TrafficService {

    private TrafficRepository trafficRepository;
    private EnvironmentRepository environmentRepository;
    private TrafficCacheRepository trafficCacheRepository;

    @Transactional(rollbackFor = Exception.class)
    public void create(String serverSdkKey, String userAgent, List<TrafficCreateRequest> requests) {
        Environment environment = environmentRepository.findByServerSdkKey(serverSdkKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT, serverSdkKey));

        requests.forEach(request -> {
            if (request.getAccess() == null) {
                return;
            }
            List<Traffic> events = Optional.of(request.getAccess().getCounters())
                    .orElse(Collections.emptyMap())
                    .entrySet()
                    .stream()
                    .flatMap(entry -> createEventEntities(entry).stream())
                    .map(event -> wrapEvent(event, userAgent, environment, request))
                    .collect(Collectors.toList());
            if (!events.isEmpty()) {
                trafficRepository.saveAll(events);
                saveAllEvaluation(events);
            }
        });
    }


    public void saveAllEvaluation(List<Traffic> events) {
        Map<String, Traffic> eventMap = events.stream()
                .collect(Collectors.toMap(Traffic::uniqueKey, u -> u, (k1, k2) -> k2));
        for (String key : eventMap.keySet()) {
            trafficCacheRepository.deleteBySdkKeyAndToggleKey(eventMap.get(key).getSdkKey(),
                    eventMap.get(key).getToggleKey());
        }
        List<Traffic> uniqueEvents = eventMap.entrySet().stream().map(Map.Entry::getValue).collect(Collectors.toList());
        List<TrafficCache> trafficCaches = uniqueEvents.stream().map(e -> toMetricsCache(e))
                .collect(Collectors.toList());
        trafficCacheRepository.saveAll(trafficCaches);
    }

    private TrafficCache toMetricsCache(Traffic event) {
        TrafficCache trafficCache = new TrafficCache();
        trafficCache.setSdkKey(event.getSdkKey());
        trafficCache.setToggleKey(event.getToggleKey());
        trafficCache.setEndDate(event.getEndDate());
        trafficCache.setStartDate(event.getStartDate());
        trafficCache.setType(TrafficCacheTypeEnum.EVALUATION);
        return trafficCache;
    }

    private List<Traffic> createEventEntities(Map.Entry<String, 
            List<VariationAccessCounterRequest>> toggleToAccessCounter) {
        String toggleKey = toggleToAccessCounter.getKey();

        return Optional.of(toggleToAccessCounter.getValue())
                .orElse(Collections.emptyList())
                .stream()
                .map(accessEvent -> this.createEventEntity(toggleKey, accessEvent))
                .collect(Collectors.toList());
    }

    private Traffic createEventEntity(String toggleKey, VariationAccessCounterRequest accessCounter) {
        Traffic event = new Traffic();
        event.setToggleKey(toggleKey);
        event.setCount(accessCounter.getCount());
        event.setValueIndex(accessCounter.getIndex());
        event.setToggleVersion(accessCounter.getVersion());

        return event;
    }

    private Traffic wrapEvent(Traffic event, String userAgent, Environment environment, TrafficCreateRequest request) {
        if (request.getAccess() == null) {
            return event;
        }
        event.setSdkKey(environment.getServerSdkKey());
        event.setProjectKey(environment.getProject().getKey());
        event.setEnvironmentKey(environment.getKey());
        event.setType("access");
        event.setSdkType(getSdkType(userAgent));
        event.setSdkVersion(getSdkVersion(userAgent));
        event.setStartDate(new Date(request.getAccess().getStartTime()));
        event.setEndDate(new Date(request.getAccess().getEndTime()));
        return event;
    }

    private String getSdkType(String userAgent) {
        if (StringUtils.isNotBlank(userAgent) && userAgent.contains("/")) {
            return userAgent.split("/")[0];
        }
        log.error("[Event] SDK user-agent format error. {} ", userAgent);
        return "";
    }

    private String getSdkVersion(String userAgent) {
        if (StringUtils.isNotBlank(userAgent) && userAgent.contains("/")) {
            return userAgent.split("/").length > 1 ? userAgent.split("/")[1] : null;
        }
        log.error("[Event] SDK user-agent format error. {} ", userAgent);
        return "";
    }

}
