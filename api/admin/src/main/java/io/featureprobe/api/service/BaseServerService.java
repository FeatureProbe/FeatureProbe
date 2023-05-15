package io.featureprobe.api.service;

import io.featureprobe.api.base.db.ExcludeTenant;
import io.featureprobe.api.base.enums.EventTypeEnum;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.model.JSEvent;
import io.featureprobe.api.base.util.JsonMapper;
import io.featureprobe.api.builder.ServerSegmentBuilder;
import io.featureprobe.api.builder.ServerToggleBuilder;
import io.featureprobe.api.dao.entity.Dictionary;
import io.featureprobe.api.dao.entity.Environment;
import io.featureprobe.api.dao.entity.Segment;
import io.featureprobe.api.dao.entity.ServerEventEntity;
import io.featureprobe.api.dao.entity.ServerSegmentEntity;
import io.featureprobe.api.dao.entity.ServerToggleEntity;
import io.featureprobe.api.dao.entity.Targeting;
import io.featureprobe.api.dao.entity.Toggle;
import io.featureprobe.api.dao.entity.ToggleControlConf;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.DictionaryRepository;
import io.featureprobe.api.dao.repository.EnvironmentRepository;
import io.featureprobe.api.dao.repository.SegmentRepository;
import io.featureprobe.api.dao.repository.TargetingRepository;
import io.featureprobe.api.dao.repository.ToggleControlConfRepository;
import io.featureprobe.api.dao.repository.ToggleRepository;
import io.featureprobe.api.dto.SdkKeyResponse;
import io.featureprobe.api.dto.ServerResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.codehaus.plexus.util.StringUtils;
import org.springframework.stereotype.Service;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
@ExcludeTenant
public class BaseServerService {

    private EnvironmentRepository environmentRepository;

    private SegmentRepository segmentRepository;

    private ToggleRepository toggleRepository;

    private TargetingRepository targetingRepository;

    private DictionaryRepository dictionaryRepository;

    private ToggleControlConfRepository toggleControlConfRepository;

    @PersistenceContext
    public EntityManager entityManager;

    public static final String SDK_KEY_DICTIONARY_KEY = "all_sdk_key_map";

    public SdkKeyResponse queryAllSdkKeys() {
        SdkKeyResponse sdkKeyResponse = new SdkKeyResponse();
        List<Environment> environments = environmentRepository.findAllByArchivedAndDeleted(false,
                false);
        environments.stream().forEach(environment -> sdkKeyResponse.put(environment.getClientSdkKey(),
                environment.getServerSdkKey()));
        Dictionary dictionary = dictionaryRepository.findByKey(SDK_KEY_DICTIONARY_KEY)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.DICTIONARY, SDK_KEY_DICTIONARY_KEY));
        sdkKeyResponse.setVersion(Long.parseLong(dictionary.getValue()));
        return sdkKeyResponse;
    }

    public ServerResponse queryServerTogglesByServerSdkKey(String serverSdkKey) {
        Environment environment = environmentRepository.findByServerSdkKeyOrClientSdkKey(serverSdkKey, serverSdkKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT, serverSdkKey));
        return new ServerResponse(queryTogglesBySdkKey(environment.getServerSdkKey()),
                querySegmentsBySdkKey(environment.getServerSdkKey()), queryEventsBySdkKey(serverSdkKey),
                environment.getVersion(), environment.getDebuggerUntilTime());
    }

    public Map<String, byte[]> queryAllServerToggle() {
        List<ServerToggleEntity> allServerToggle = environmentRepository.findAllServerToggle();
        List<ServerSegmentEntity> allServerSegment = environmentRepository.findAllServerSegment();
        List<ServerEventEntity> allServerEvent = environmentRepository.findAllServerEvent();
        return buildAllServerToggle(allServerToggle, allServerSegment, allServerEvent);
    }

    private Map<String, byte[]>  buildAllServerToggle(List<ServerToggleEntity> allServerToggle,
                                                      List<ServerSegmentEntity> allServerSegment,
                                                      List<ServerEventEntity> allServerEvent) {
        Map<String, List<Segment>> segmentsMap = new HashMap<>();
        allServerSegment.stream().forEach(serverSegment -> {
            if (segmentsMap.containsKey(getServerSegmentUniqueKey(serverSegment))) {
                segmentsMap.get(getServerSegmentUniqueKey(serverSegment)).add(toSegment(serverSegment));
            } else {
                List<Segment> segments = new ArrayList<>();
                segments.add(toSegment(serverSegment));
                segmentsMap.put(getServerSegmentUniqueKey(serverSegment), segments);
            }
        });
        Map<String, List<JSEvent>> eventMap = new HashMap<>();
        allServerEvent.stream()
                .filter(e -> (EventTypeEnum.PAGE_VIEW.equals(e.getType()) ||
                        (EventTypeEnum.CLICK.equals(e.getType()))))
                .forEach(serverEvent -> {
                    if (eventMap.containsKey(serverEvent.getServerSdkKey())) {
                        eventMap.get(serverEvent.getServerSdkKey()).add(toEvent(serverEvent));
                    } else {
                        List<JSEvent> events = new ArrayList<>();
                        events.add(toEvent(serverEvent));
                        eventMap.put(serverEvent.getServerSdkKey(), events);
                    }
                });
        Map<String, List<Toggle>> toggleMap = new HashMap<>();
        Map<String, List<Targeting>> targetingMap = new HashMap<>();
        Map<String, ServerEnv> serverEnvMap = new HashMap<>();
        Map<String, List<ToggleControlConf>> controlConfMap = new HashMap<>();
        toggleSplit(toggleMap, targetingMap, serverEnvMap, controlConfMap, allServerToggle);
        Map<String, byte[]> allServerResponse = new HashMap<>();
        for (String serverSdkKey : targetingMap.keySet()) {
            List<Segment> segments = segmentsMap.getOrDefault(serverEnvMap.get(serverSdkKey)
                            .getServerSegmentUniqueKey(), Collections.emptyList()).stream()
                    .filter(distinctByKey(Segment::uniqueKey)).collect(Collectors.toList());
            List<Toggle> toggles = toggleMap.getOrDefault(serverEnvMap.get(serverSdkKey)
                            .getServerToggleUniqueKey(), Collections.emptyList()).stream()
                    .filter(distinctByKey(Toggle::uniqueKey)).collect(Collectors.toList());
            List<Targeting> targetingList = targetingMap.getOrDefault(serverSdkKey, Collections.emptyList()).stream()
                    .filter(distinctByKey(Targeting::uniqueKey)).collect(Collectors.toList());
            List<ToggleControlConf> controlConfList = controlConfMap
                    .getOrDefault(serverSdkKey, Collections.emptyList()).stream()
                    .filter(distinctByKey(ToggleControlConf::uniqueKey))
                    .collect(Collectors.toList());
            ServerResponse serverResponse = new ServerResponse(
                    buildServerToggles(segments, toggles, targetingList, controlConfList),
                    buildServerSegments(segments),
                    eventMap.getOrDefault(serverSdkKey,  Collections.emptyList())
                            .stream().filter(distinctByKey(JSEvent::getName)).collect(Collectors.toList()),
                    serverEnvMap.get(serverSdkKey).getEnvVersion(),
                    serverEnvMap.get(serverSdkKey).getDebugUntilTime());
            allServerResponse.put(serverSdkKey, JsonMapper.toJSONString(serverResponse).getBytes());
        }
        return allServerResponse;
    }

    private void toggleSplit(Map<String, List<Toggle>> toggleMap,
                             Map<String, List<Targeting>> targetingMap ,
                             Map<String, ServerEnv> serverEnvMap,
                             Map<String, List<ToggleControlConf>> controlConfMap,
                             List<ServerToggleEntity> allServerToggle)  {
        allServerToggle.stream().forEach(serverToggle -> {
            if (toggleMap.containsKey(getServerToggleUniqueKey(serverToggle))) {
                toggleMap.get(getServerToggleUniqueKey(serverToggle)).add(toToggle(serverToggle));
            } else if (Objects.nonNull(serverToggle.getToggleKey())) {
                List<Toggle> toggles = new ArrayList<>();
                toggles.add(toToggle(serverToggle));
                toggleMap.put(getServerToggleUniqueKey(serverToggle), toggles);
            }

            if (targetingMap.containsKey(serverToggle.getServerSdkKey()) &&
                    Objects.nonNull(serverToggle.getToggleKey())) {
                targetingMap.get(serverToggle.getServerSdkKey()).add(toTargeting(serverToggle));
            } else {
                List<Targeting> targetingList = new ArrayList<>();
                if (Objects.nonNull(serverToggle.getToggleKey())) {
                    targetingList.add(toTargeting(serverToggle));
                }
                targetingMap.put(serverToggle.getServerSdkKey(), targetingList);
            }

            if (!serverEnvMap.containsKey(serverToggle.getServerSdkKey())) {
                serverEnvMap.put(serverToggle.getServerSdkKey(), toServerEnv(serverToggle));
            }

            if (controlConfMap.containsKey(serverToggle.getServerSdkKey())) {
                controlConfMap.get(serverToggle.getServerSdkKey()).add(toControlConf(serverToggle));
            } else {
                List<ToggleControlConf> controlConfList = new ArrayList<>();
                controlConfList.add(toControlConf(serverToggle));
                controlConfMap.put(serverToggle.getServerSdkKey(), controlConfList);
            }
        });
    }

    private static <T> Predicate<T> distinctByKey(Function<? super T, ?> keyExtractor) {
        Map<Object, Boolean> seen = new ConcurrentHashMap<>();
        return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }

    private String getServerSegmentUniqueKey(ServerSegmentEntity serverSegment) {
        return serverSegment.getProjectKey() + "$" + serverSegment.getOrganizationId();
    }

    private String getServerToggleUniqueKey(ServerToggleEntity serverToggle) {
        return serverToggle.getProjectKey() + "$" + serverToggle.getOrganizationId();
    }

    private Segment toSegment(ServerSegmentEntity serverSegment) {
        Segment segment = new Segment();
        segment.setKey(serverSegment.getSegmentKey());
        segment.setUniqueKey(serverSegment.getSegmentUniqueKey());
        segment.setVersion(serverSegment.getSegmentVersion());
        segment.setRules(serverSegment.getSegmentRules());
        return segment;
    }

    private Toggle toToggle(ServerToggleEntity serverToggle) {
        Toggle toggle = new Toggle();
        toggle.setProjectKey(serverToggle.getProjectKey());
        toggle.setKey(serverToggle.getToggleKey());
        toggle.setReturnType(serverToggle.getReturnType());
        toggle.setClientAvailability(serverToggle.getClientAvailability());
        return toggle;
    }

    private Targeting toTargeting(ServerToggleEntity serverToggle) {
        Targeting targeting = new Targeting();
        targeting.setToggleKey(serverToggle.getToggleKey());
        targeting.setDisabled(serverToggle.getTargetingDisabled());
        targeting.setVersion(serverToggle.getTargetingVersion());
        targeting.setContent(serverToggle.getTargetingContent());
        targeting.setOrganizationId(serverToggle.getOrganizationId());
        targeting.setProjectKey(serverToggle.getProjectKey());
        targeting.setEnvironmentKey(serverToggle.getEnvKey());
        targeting.setPublishTime(serverToggle.getPublishTime());
        return targeting;
    }

    private ServerEnv toServerEnv(ServerToggleEntity serverToggle) {
        ServerEnv serverEnv = new ServerEnv();
        serverEnv.setEnvVersion(serverToggle.getEnvVersion());
        Long debugUntilTime = (Objects.isNull(serverToggle.getDebugUntilTime()) ||
                serverToggle.getDebugUntilTime() == 0)
                ? null : serverToggle.getDebugUntilTime();
        serverEnv.setDebugUntilTime(debugUntilTime);
        serverEnv.setOrganizationId(serverToggle.getOrganizationId());
        serverEnv.setProjectKey(serverToggle.getProjectKey());
        serverEnv.setEnvKey(serverToggle.getEnvKey());
        return serverEnv;
    }

    private JSEvent toEvent(ServerEventEntity serverEvent){
        JSEvent event = new JSEvent();
        if (EventTypeEnum.CLICK.equals(serverEvent.getType()) && StringUtils.isBlank(serverEvent.getSelector())) {
            event.setType(EventTypeEnum.PAGE_VIEW);
        } else {
            event.setType(serverEvent.getType());
        }
        event.setName(serverEvent.getName());
        event.setMatcher(serverEvent.getMatcher());
        event.setUrl(serverEvent.getUrl());
        event.setSelector(serverEvent.getSelector());
        return event;
    }

    private ToggleControlConf toControlConf(ServerToggleEntity toggleEntity) {
        ToggleControlConf controlConf = new ToggleControlConf();
        controlConf.setOrganizationId(toggleEntity.getOrganizationId());
        controlConf.setProjectKey(toggleEntity.getProjectKey());
        controlConf.setEnvironmentKey(toggleEntity.getEnvKey());
        controlConf.setToggleKey(toggleEntity.getToggleKey());
        controlConf.setTrackAccessEvents(
                !Objects.isNull(toggleEntity.getTrackAccessEvents()) && toggleEntity.getTrackAccessEvents());
        return controlConf;
    }

    private List<com.featureprobe.sdk.server.model.Toggle> queryTogglesBySdkKey(String serverSdkKey) {
        Environment environment = environmentRepository.findByServerSdkKey(serverSdkKey).get();
        if (Objects.isNull(environment)) {
            return Collections.emptyList();
        }
        List<Segment> segments = segmentRepository.findAllByProjectKeyAndOrganizationIdAndDeleted(
                environment.getProject().getKey(), environment.getOrganizationId(), false);
        List<Toggle> toggles = toggleRepository.findAllByProjectKeyAndOrganizationIdAndArchivedAndDeleted(
                environment.getProject().getKey(), environment.getOrganizationId(), false, false);
        List<Targeting> targetingList = targetingRepository
                .findAllByProjectKeyAndEnvironmentKeyAndOrganizationIdAndDeleted(environment.getProject().getKey(),
                        environment.getKey(), environment.getOrganizationId(), false);
        List<ToggleControlConf> controlConfList = toggleControlConfRepository
                .findByProjectKeyAndEnvironmentKeyAndOrganizationId(environment.getProject().getKey(),
                        environment.getKey(), environment.getOrganizationId());
        return buildServerToggles(segments, toggles, targetingList, controlConfList);
    }

    private List<com.featureprobe.sdk.server.model.Segment> querySegmentsBySdkKey(String serverSdkKey) {
        Environment environment = environmentRepository.findByServerSdkKey(serverSdkKey).get();
        if (Objects.isNull(environment)) {
            return Collections.emptyList();
        }
        List<Segment> segments = segmentRepository.findAllByProjectKeyAndOrganizationIdAndDeleted(
                environment.getProject().getKey(), environment.getOrganizationId(), false);
        return buildServerSegments(segments);
    }

    private List<JSEvent> queryEventsBySdkKey(String serverSdkKey) {
        List<ServerEventEntity> serverEventEntities = environmentRepository.findAllServerEventBySdkKey(serverSdkKey);
        return serverEventEntities.stream()
                .filter(serverEvent -> (EventTypeEnum.PAGE_VIEW.equals(serverEvent.getType())
                        || (EventTypeEnum.CLICK.equals(serverEvent.getType()))))
                .filter(distinctByKey(ServerEventEntity::getName))
                .map(serverEvent -> toEvent(serverEvent))
                .collect(Collectors.toList());
    }

    private List<com.featureprobe.sdk.server.model.Segment> buildServerSegments(List<Segment> segments) {
        return segments.stream().map(segment -> {
            try {
                return new ServerSegmentBuilder().builder()
                        .uniqueId(segment.getUniqueKey())
                        .version(segment.getVersion())
                        .rules(segment.getRules())
                        .build();
            } catch (Exception e) {
                log.error("Build server segment failed, unique key: {}, segment key: {}",
                        segment.getUniqueKey(), segment.getKey(), e);
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    private List<com.featureprobe.sdk.server.model.Toggle> buildServerToggles(
            List<Segment> segments,
            List<Toggle> toggles,
            List<Targeting> targetingList,
            List<ToggleControlConf> controlConfList) {
        Map<String, Targeting> targetingByKey = targetingList.stream()
                .collect(Collectors.toMap(Targeting::getToggleKey, Function.identity()));
        Map<String, ToggleControlConf> controlConfByKey = controlConfList.stream()
                .collect(Collectors.toMap(ToggleControlConf::getToggleKey, Function.identity()));
        return toggles.stream().map(toggle -> {
            Targeting targeting = targetingByKey.get(toggle.getKey());
            ToggleControlConf controlConf = controlConfByKey.get(toggle.getKey());
            try {
                return new ServerToggleBuilder().builder()
                        .key(toggle.getKey())
                        .disabled(targeting.isDisabled())
                        .version(targeting.getVersion())
                        .returnType(toggle.getReturnType())
                        .forClient(toggle.getClientAvailability())
                        .rules(targeting.getContent())
                        .trackAccessEvents(!Objects.isNull(controlConf) && controlConf.isTrackAccessEvents())
                        .lastModified(targeting.getPublishTime())
                        .segments(segments.stream().collect(Collectors.toMap(Segment::getKey, Function.identity())))
                        .build();
            } catch (Exception e) {
                log.warn("Build server toggle failed, OrganizationId : {}, projectKey:{}, " +
                                " toggle key: {}", toggle.getOrganizationId(), toggle.getProjectKey(),
                        toggle.getKey(), e);
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }
    @Data
    class ServerEnv {

        Long envVersion;

        Long debugUntilTime;
        Long organizationId;

        String projectKey;

        String envKey;

        private String getServerSegmentUniqueKey() {
            return projectKey + "$" + organizationId;
        }

        private String getServerToggleUniqueKey() {
            return projectKey + "$" + organizationId;
        }

    }

}
