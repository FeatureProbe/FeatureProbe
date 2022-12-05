package com.featureprobe.api.service;

import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.enums.MetricsCacheTypeEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dao.entity.MetricsCache;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.EventRepository;
import com.featureprobe.api.dao.repository.MetricsCacheRepository;
import com.featureprobe.api.dto.EventCreateRequest;
import com.featureprobe.api.dto.VariationAccessCounter;
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
public class EventService {

    private EventRepository eventRepository;
    private EnvironmentRepository environmentRepository;
    private MetricsCacheRepository metricsCacheRepository;

    @Transactional(rollbackFor = Exception.class)
    public void create(String serverSdkKey, String userAgent, List<EventCreateRequest> requests) {
        Environment environment = environmentRepository.findByServerSdkKey(serverSdkKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT, serverSdkKey));

        requests.forEach(request -> {
            if (request.getAccess() == null) {
                return;
            }
            List<Event> events = Optional.of(request.getAccess().getCounters())
                    .orElse(Collections.emptyMap())
                    .entrySet()
                    .stream()
                    .flatMap(entry -> createEventEntities(entry).stream())
                    .map(event -> wrapEvent(event, userAgent, environment, request))
                    .collect(Collectors.toList());
            if (!events.isEmpty()) {
                eventRepository.saveAll(events);
                saveAllEvaluation(events);
            }
        });
    }


    public void saveAllEvaluation(List<Event> events) {
        Map<String, Event> eventMap = events.stream()
                .collect(Collectors.toMap(Event::uniqueKey, u -> u, (k1, k2) -> k2));
        for (String key : eventMap.keySet()) {
            metricsCacheRepository.deleteBySdkKeyAndToggleKey(eventMap.get(key).getSdkKey(),
                    eventMap.get(key).getToggleKey());
        }
        List<Event> uniqueEvents = eventMap.entrySet().stream().map(Map.Entry::getValue).collect(Collectors.toList());
        List<MetricsCache> metricsCaches = uniqueEvents.stream().map(e -> toMetricsCache(e))
                .collect(Collectors.toList());
        metricsCacheRepository.saveAll(metricsCaches);
    }

    private MetricsCache toMetricsCache(Event event) {
        MetricsCache metricsCache = new MetricsCache();
        metricsCache.setSdkKey(event.getSdkKey());
        metricsCache.setToggleKey(event.getToggleKey());
        metricsCache.setEndDate(event.getEndDate());
        metricsCache.setStartDate(event.getStartDate());
        metricsCache.setType(MetricsCacheTypeEnum.EVALUATION);
        return metricsCache;
    }

    private List<Event> createEventEntities(Map.Entry<String, List<VariationAccessCounter>> toggleToAccessCounter) {
        String toggleKey = toggleToAccessCounter.getKey();

        return Optional.of(toggleToAccessCounter.getValue())
                .orElse(Collections.emptyList())
                .stream()
                .map(accessEvent -> this.createEventEntity(toggleKey, accessEvent))
                .collect(Collectors.toList());
    }

    private Event createEventEntity(String toggleKey, VariationAccessCounter accessCounter) {
        Event event = new Event();
        event.setToggleKey(toggleKey);
        event.setCount(accessCounter.getCount());
        event.setValueIndex(accessCounter.getIndex());
        event.setToggleVersion(accessCounter.getVersion());

        return event;
    }

    private Event wrapEvent(Event event, String userAgent, Environment environment, EventCreateRequest request) {
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
