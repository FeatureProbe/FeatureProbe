package com.featureprobe.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.enums.ResponseCodeEnum;
import com.featureprobe.api.base.model.BaseResponse;
import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.api.dao.entity.DebugEvent;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.EventTracker;
import com.featureprobe.api.dao.entity.Traffic;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.DebugEventRepository;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.EventTrackerRepository;
import com.featureprobe.api.dao.repository.TrafficRepository;
import com.featureprobe.api.dto.DebugEventResponse;
import com.featureprobe.api.dto.EventStreamResponse;
import com.featureprobe.api.dto.EventTrackerStatusRequest;
import com.featureprobe.api.dto.SummaryEvent;
import com.featureprobe.api.mapper.EventMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class EventTrackerService {


    EnvironmentRepository environmentRepository;
    EventTrackerRepository eventTrackerRepository;

    AnalysisServerService analysisServerService;

    DebugEventRepository debugEventRepository;

    TrafficRepository trafficRepository;

    private ChangeLogService changeLogService;

    @PersistenceContext
    public EntityManager entityManager;

    final ObjectMapper mapper = new ObjectMapper();

    @Transactional(rollbackFor = Exception.class)
    public EventStreamResponse getEventStream(String projectKey, String environmentKey, String uuid) {
        EventStreamResponse response = new EventStreamResponse();
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT,
                        projectKey + "/" + environmentKey));
        response.setProjectKey(projectKey);
        response.setEnvironmentKey(environmentKey);
        response.setDebugUntilTime(environment.getDebuggerUntilTime());
        if (!(environment.getDebuggerUntilTime() > System.currentTimeMillis())) {
            return response;
        }
        response.setDebuggerEnabled(true);
        Optional<EventTracker> eventTrackerOptional = eventTrackerRepository
                .findByProjectKeyAndEnvironmentKeyAndUuid(projectKey, environmentKey, uuid);
        if (eventTrackerOptional.isPresent()) {
            List<Object> events = new ArrayList<>();
            EventTracker eventTracker = eventTrackerOptional.get();
            List<DebugEventResponse> debugEvents = debugEventRepository
                    .findAllBySdkKeyAndTimeGreaterThanEqual(environment.getServerSdkKey(), eventTracker.getTime())
                    .stream().map(debugEvent -> EventMapper.INSTANCE.debugEventToResponse(debugEvent))
                    .collect(Collectors.toList());
            List<Traffic> traffic = trafficRepository
                    .findAllBySdkKeyAndStartDateGreaterThanEqual(environment.getServerSdkKey(),
                    new Date(eventTracker.getTime()));
            List<SummaryEvent> summaryEvents = traffic.stream().map(SummaryEvent::create).collect(Collectors.toList());
            events.addAll(debugEvents);
            events.addAll(summaryEvents);
            try {
                List<Object> accessEvents = callAnalysis(eventTracker.getTime(), environment.getServerSdkKey());
                events.addAll(accessEvents);
            }catch (Exception e) {
                log.error("Get access event stream is error.", e);
            }
            if (CollectionUtils.isNotEmpty(events)) {
                events = events.stream().sorted((a, b) -> compareEvent(a, b)).collect(Collectors.toList());
                updateEventTrackerTime(eventTracker, System.currentTimeMillis());
            }
            response.setEvents(events);
            return response;
        }
        saveEventTracker(projectKey, environmentKey, uuid);
        return response;
    }

    private int compareEvent(Object first, Object second) {
        Map firstEvent = mapper.convertValue(first, Map.class);
        Long firstTime = (Long) firstEvent.get("time");
        if (first instanceof SummaryEvent) {
            firstTime = ((SummaryEvent) first).getStartDate().getTime();
        }
        Map secondEvent = mapper.convertValue(second, Map.class);
        Long secondTime = (Long) secondEvent.get("time");
        if (second instanceof SummaryEvent) {
            secondTime = ((SummaryEvent) second).getStartDate().getTime();
        }
        return Long.compare(firstTime, secondTime);
    }

    @Transactional(rollbackFor = Exception.class)
    public BaseResponse status(String projectKey, String environmentKey, EventTrackerStatusRequest statusRequest) {
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT,
                        projectKey + "/" + environmentKey));
        if (statusRequest.isEnabled()) {
            environment.setDebuggerUntilTime(System.currentTimeMillis() + 30 * 60 * 1000);
        } else {
            environment.setDebuggerUntilTime(0L);
        }
        environmentRepository.save(environment);
        changeLogService.create(environment, ChangeLogType.CHANGE);
        return new BaseResponse(ResponseCodeEnum.SUCCESS);
    }

    private void saveEventTracker(String projectKey, String environmentKey, String uuid) {
        EventTracker eventTracker = new EventTracker();
        eventTracker.setProjectKey(projectKey);
        eventTracker.setEnvironmentKey(environmentKey);
        eventTracker.setUuid(uuid);
        eventTracker.setTime(System.currentTimeMillis());
        eventTrackerRepository.save(eventTracker);
    }

    private void updateEventTrackerTime(EventTracker eventTracker, long time) {
        eventTracker.setTime(time);
        eventTrackerRepository.save(eventTracker);
    }

    private List<Object> callAnalysis(Long time, String sdkKey) {
        Map<String, Object> params = new HashMap<>();
        params.put("time", time);
        String callRes = analysisServerService.callAnalysisServer("/events",
                analysisServerService.formatHttpQuery(params), sdkKey);
        List<Object> events = JsonMapper.toListObject(callRes, Object.class);
        return events;
    }


}
