package io.featureprobe.api.service;

import io.featureprobe.api.base.db.ExcludeTenant;
import io.featureprobe.api.base.enums.TrafficCacheTypeEnum;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.util.JsonMapper;
import io.featureprobe.api.dao.entity.DebugEvent;
import io.featureprobe.api.dao.entity.Environment;
import io.featureprobe.api.dao.entity.Traffic;
import io.featureprobe.api.dao.entity.TrafficCache;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.DebugEventRepository;
import io.featureprobe.api.dao.repository.EnvironmentRepository;
import io.featureprobe.api.dao.repository.TrafficRepository;
import io.featureprobe.api.dao.repository.TrafficCacheRepository;
import io.featureprobe.api.dto.TrafficCreateRequest;
import io.featureprobe.api.dto.VariationAccessCounterRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
@ExcludeTenant
public class TrafficService {

    private TrafficRepository trafficRepository;
    private EnvironmentRepository environmentRepository;
    private TrafficCacheRepository trafficCacheRepository;
    private DebugEventRepository debugEventRepository;

    private final static ExecutorService executorService = Executors.newFixedThreadPool(5);

    @Transactional(rollbackFor = Exception.class)
    public void create(String serverSdkKey, String userAgent, List<TrafficCreateRequest> requests) {
        Environment environment = environmentRepository.findByServerSdkKey(serverSdkKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT, serverSdkKey));

        requests.forEach(request -> {
            if (request.getAccess() == null) {
                return;
            }
            if (CollectionUtils.isNotEmpty(request.getEvents())) {
                DebugEventStorageTask debugEventStorageTask = new DebugEventStorageTask(serverSdkKey,
                        debugEventRepository, request.getEvents(), userAgent);
                executorService.submit(debugEventStorageTask);
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
        event.setValue(JsonMapper.toJSONString(accessCounter.getValue()));
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
        return extractSdkField(userAgent, 0);
    }

    private String getSdkVersion(String userAgent) {
        return extractSdkField(userAgent, 1);
    }

    private String extractSdkField(String userAgent, int index) {
        if (StringUtils.isBlank(userAgent) || !userAgent.contains("/")) {
            log.error("[Event] SDK user-agent format error. {} ", userAgent);
            return "";
        }
        String[] parts = userAgent.split("/");
        return parts.length > index ? parts[index] : null;
    }

    class DebugEventStorageTask implements Runnable {


        private final String sdkKey;
        private final DebugEventRepository debugEventRepository;

        private final List<Map> events;

        private final String userAgent;

        public DebugEventStorageTask(String sdkKey, DebugEventRepository debugEventRepository, List<Map> events,
                                     String userAgent) {
            this.sdkKey = sdkKey;
            this.debugEventRepository = debugEventRepository;
            this.events = events;
            this.userAgent = userAgent;
        }

        @Override
        public void run() {
            if (Objects.nonNull(events) && CollectionUtils.isNotEmpty(events)) {
                List<DebugEvent> debugEvents = events.stream().filter(event -> "debug".equals(event.get("kind")))
                        .map(event -> buildDebugEvent(event, sdkKey, userAgent)).collect(Collectors.toList());
                debugEventRepository.saveAll(debugEvents);
            }
        }
    }

    private DebugEvent buildDebugEvent(Map event, String sdkKey, String userAgent) {
        DebugEvent debugEvent = new DebugEvent();
        debugEvent.setSdkKey(sdkKey);
        debugEvent.setKind(String.valueOf(event.get("kind")));
        debugEvent.setTime((Long) event.get("time"));
        debugEvent.setUserKey(String.valueOf(event.get("user")));
        debugEvent.setUserDetail(JsonMapper.toJSONString(event.get("userDetail")));
        debugEvent.setToggleKey(String.valueOf(event.get("key")));
        debugEvent.setValue(JsonMapper.toJSONString(event.get("value")));
        debugEvent.setVersion((Integer) event.get("version"));
        debugEvent.setVariationIndex((Integer) event.get("variationIndex"));
        debugEvent.setRuleIndex((Integer) event.get("ruleIndex"));
        debugEvent.setReason(String.valueOf(event.get("reason")));
        debugEvent.setSdkType(getSdkType(userAgent));
        debugEvent.setSdkVersion(getSdkVersion(userAgent));
        return debugEvent;
    }
}
