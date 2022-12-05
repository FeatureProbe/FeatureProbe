package com.featureprobe.api.service;

import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.api.builder.ServerSegmentBuilder;
import com.featureprobe.api.builder.ServerToggleBuilder;
import com.featureprobe.api.dao.entity.Dictionary;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Segment;
import com.featureprobe.api.dao.entity.ServerSegmentEntity;
import com.featureprobe.api.dao.entity.ServerToggleEntity;
import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.dao.entity.Toggle;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.DictionaryRepository;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.SegmentRepository;
import com.featureprobe.api.dao.repository.TargetingRepository;
import com.featureprobe.api.dao.repository.ToggleRepository;
import com.featureprobe.api.dto.SdkKeyResponse;
import com.featureprobe.api.dto.ServerResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
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
                querySegmentsBySdkKey(environment.getServerSdkKey()), environment.getVersion());
    }

    public Map<String, byte[]> queryAllServerToggle() {
        List<ServerToggleEntity> allServerToggle = environmentRepository.findAllServerToggle();
        List<ServerSegmentEntity> allServerSegment = environmentRepository.findAllServerSegment();
        return buildAllServerToggle(allServerToggle, allServerSegment);
    }

    private Map<String, byte[]>  buildAllServerToggle(List<ServerToggleEntity> allServerToggle,
                                                 List<ServerSegmentEntity> allServerSegment) {
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
        Map<String, List<Toggle>> toggleMap = new HashMap<>();
        Map<String, List<Targeting>> targetingMap = new HashMap<>();
        Map<String, ServerEnv> serverEnvMap = new HashMap<>();
        toggleSplit(toggleMap, targetingMap, serverEnvMap, allServerToggle);
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
            ServerResponse serverResponse = new ServerResponse(buildServerToggles(segments, toggles, targetingList),
                    buildServerSegments(segments), serverEnvMap.get(serverSdkKey).getEnvVersion());
            allServerResponse.put(serverSdkKey, JsonMapper.toJSONString(serverResponse).getBytes());
        }
        return allServerResponse;
    }

    private void toggleSplit(Map<String, List<Toggle>> toggleMap,
                             Map<String, List<Targeting>> targetingMap ,
                             Map<String, ServerEnv> serverEnvMap,
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
        return targeting;
    }

    private ServerEnv toServerEnv(ServerToggleEntity serverToggle) {
        ServerEnv serverEnv = new ServerEnv();
        serverEnv.setEnvVersion(serverToggle.getEnvVersion());
        serverEnv.setOrganizationId(serverToggle.getOrganizationId());
        serverEnv.setProjectKey(serverToggle.getProjectKey());
        serverEnv.setEnvKey(serverToggle.getEnvKey());
        return serverEnv;
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
        return buildServerToggles(segments, toggles, targetingList);
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

    private List<com.featureprobe.sdk.server.model.Toggle> buildServerToggles(List<Segment> segments,
                                                                              List<Toggle> toggles,
                                                                              List<Targeting> targetingList) {
        Map<String, Targeting> targetingByKey = targetingList.stream()
                .collect(Collectors.toMap(Targeting::getToggleKey, Function.identity()));
        return toggles.stream().map(toggle -> {
            Targeting targeting = targetingByKey.get(toggle.getKey());
            try {
                return new ServerToggleBuilder().builder()
                        .key(toggle.getKey())
                        .disabled(targeting.isDisabled())
                        .version(targeting.getVersion())
                        .returnType(toggle.getReturnType())
                        .forClient(toggle.getClientAvailability())
                        .rules(targeting.getContent())
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
