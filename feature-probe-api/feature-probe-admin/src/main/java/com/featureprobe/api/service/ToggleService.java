package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.db.Archived;
import com.featureprobe.api.base.model.TargetingContent;
import com.featureprobe.api.base.model.Variation;
import com.featureprobe.api.component.SpringBeanManager;
import com.featureprobe.api.config.AppConfig;
import com.featureprobe.api.dao.exception.ResourceConflictException;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.exception.ResourceOverflowException;
import com.featureprobe.api.dao.utils.PageRequestUtil;
import com.featureprobe.api.dto.ToggleCreateRequest;
import com.featureprobe.api.dto.ToggleItemResponse;
import com.featureprobe.api.dto.ToggleResponse;
import com.featureprobe.api.dto.ToggleSearchRequest;
import com.featureprobe.api.dto.ToggleUpdateRequest;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.MetricsCache;
import com.featureprobe.api.dao.entity.Project;
import com.featureprobe.api.dao.entity.Tag;
import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.dao.entity.TargetingSketch;
import com.featureprobe.api.dao.entity.TargetingVersion;
import com.featureprobe.api.dao.entity.Toggle;
import com.featureprobe.api.dao.entity.ToggleTagRelation;
import com.featureprobe.api.dao.entity.VariationHistory;
import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.MetricsCacheTypeEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.enums.SketchStatusEnum;
import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import com.featureprobe.api.base.enums.VisitFilter;
import com.featureprobe.api.mapper.ToggleMapper;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.EventRepository;
import com.featureprobe.api.dao.repository.MetricsCacheRepository;
import com.featureprobe.api.dao.repository.ProjectRepository;
import com.featureprobe.api.dao.repository.TagRepository;
import com.featureprobe.api.dao.repository.TargetingRepository;
import com.featureprobe.api.dao.repository.TargetingSketchRepository;
import com.featureprobe.api.dao.repository.TargetingVersionRepository;
import com.featureprobe.api.dao.repository.ToggleRepository;
import com.featureprobe.api.dao.repository.ToggleTagRepository;
import com.featureprobe.api.dao.repository.VariationHistoryRepository;
import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.sdk.server.FPUser;
import com.featureprobe.sdk.server.FeatureProbe;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
@AllArgsConstructor
public class ToggleService {

    private AppConfig appConfig;
    private ToggleRepository toggleRepository;

    private TagRepository tagRepository;

    private TargetingRepository targetingRepository;

    private EnvironmentRepository environmentRepository;

    private EventRepository eventRepository;

    private TargetingVersionRepository targetingVersionRepository;

    private VariationHistoryRepository variationHistoryRepository;

    private TargetingSketchRepository targetingSketchRepository;

    private MetricsCacheRepository metricsCacheRepository;

    private ToggleTagRepository toggleTagRepository;

    private ChangeLogService changeLogService;

    private ProjectRepository projectRepository;

    @PersistenceContext
    public EntityManager entityManager;

    private static final String LIMITER_TOGGLE_KEY = "FeatureProbe_toggle_limiter";

    @Transactional(rollbackFor = Exception.class)
    public ToggleResponse create(String projectKey, ToggleCreateRequest createRequest) {
        validateLimit(projectKey);
        Toggle toggle = createToggle(projectKey, createRequest);
        createDefaultTargetingEntities(projectKey, toggle);
        return ToggleMapper.INSTANCE.entityToResponse(toggle, appConfig.getToggleDeadline());
    }


    @Transactional(rollbackFor = Exception.class)
    public ToggleResponse update(String projectKey, String toggleKey, ToggleUpdateRequest updateRequest) {
        Toggle toggle = toggleRepository.findByProjectKeyAndKey(projectKey, toggleKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.TOGGLE, toggleKey));
        if (StringUtils.isNotBlank(updateRequest.getName()) &&
                !StringUtils.equals(toggle.getName(), updateRequest.getName())) {
            validateName(projectKey, updateRequest.getName());
        }
        ToggleMapper.INSTANCE.mapEntity(updateRequest, toggle);
        if (CollectionUtils.isNotEmpty(updateRequest.getTags())) {
            setToggleTagRefs(toggle, updateRequest.getTags());
        }
        toggleRepository.save(toggle);
        return ToggleMapper.INSTANCE.entityToResponse(toggle, appConfig.getToggleDeadline());
    }

    @Transactional(rollbackFor = Exception.class)
    @Archived
    public ToggleResponse offline(String projectKey, String toggleKey) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        Toggle toggle = toggleRepository.findByProjectKeyAndKeyAndArchived(projectKey, toggleKey, false)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.TOGGLE, toggleKey));
        for (Environment environment : project.getEnvironments()) {
            changeLogService.create(environment, ChangeLogType.CHANGE);
        }
        toggle.setArchived(true);
        return ToggleMapper.INSTANCE.entityToResponse(toggleRepository.save(toggle), appConfig.getToggleDeadline());
    }

    @Transactional(rollbackFor = Exception.class)
    @Archived
    public ToggleResponse restore(String projectKey, String toggleKey) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        Toggle toggle = toggleRepository.findByProjectKeyAndKeyAndArchived(projectKey, toggleKey, true)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.TOGGLE, toggleKey));
        for (Environment environment : project.getEnvironments()) {
            changeLogService.create(environment, ChangeLogType.CHANGE);
        }
        toggle.setArchived(false);
        return ToggleMapper.INSTANCE.entityToResponse(toggleRepository.save(toggle), appConfig.getToggleDeadline());
    }

    @Archived
    public Page<ToggleItemResponse> list(String projectKey, ToggleSearchRequest searchRequest) {
        Page<Toggle> togglePage;
        if (StringUtils.isNotBlank(searchRequest.getEnvironmentKey())) {
            Environment environment = environmentRepository
                    .findByProjectKeyAndKeyAndArchived(projectKey, searchRequest.getEnvironmentKey(), false)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(ResourceType.ENVIRONMENT, searchRequest.getEnvironmentKey()));
            Set<String> toggleKeys = new TreeSet<>();
            boolean isPrecondition = false;
            if (Objects.nonNull(searchRequest.getDisabled())) {
                isPrecondition = true;
                Set<String> keys = queryToggleKeysByDisabled(projectKey, searchRequest.getEnvironmentKey(),
                        searchRequest.getDisabled());
                retainAllKeys(toggleKeys, keys);
            }
            if (CollectionUtils.isNotEmpty(searchRequest.getTags())) {
                isPrecondition = true;
                Set<String> keys = queryToggleKeysByTags(searchRequest.getTags());
                retainAllKeys(toggleKeys, keys);
            }
            if (Objects.nonNull(searchRequest.getVisitFilter())) {
                isPrecondition = true;
                Set<String> keys = queryToggleKeysByVisited(searchRequest.getVisitFilter(), projectKey, environment);
                retainAllKeys(toggleKeys, keys);
            }
            if (CollectionUtils.isNotEmpty(searchRequest.getReleaseStatusList())) {
                isPrecondition = true;
                Set<String> keys = queryToggleKeysByReleaseStatus(projectKey, searchRequest.getEnvironmentKey(),
                        searchRequest.getReleaseStatusList());
                retainAllKeys(toggleKeys, keys);
            }
            togglePage = compoundQuery(projectKey, searchRequest, toggleKeys, isPrecondition);
            List<String> keys = togglePage.getContent().stream().map(Toggle::getKey).collect(Collectors.toList());
            Map<String, Targeting> targetingMap = queryTargetingMap(projectKey, searchRequest.getEnvironmentKey(),
                    keys);
            Map<String, TargetingSketch> targetingSketchMap = queryNewestTargetingSketchMap(projectKey,
                    searchRequest.getEnvironmentKey(), keys);
            Map<String, MetricsCache> metricsCacheMap = queryMetricsCacheMap(projectKey,
                    searchRequest.getEnvironmentKey(), keys);
            Map<String, Set<String>> tagMap = queryTagMap(keys);
            return togglePage.map(item ->
                    entityToItemResponse(item, projectKey, searchRequest.getEnvironmentKey(),
                            targetingMap, targetingSketchMap, metricsCacheMap, tagMap));
        } else {
            togglePage = toggleRepository.findAllByProjectKeyAndArchived(projectKey, false,
                    PageRequestUtil.toPageable(searchRequest, Sort.Direction.DESC, "createdTime"));
            return togglePage.map(item -> ToggleMapper.INSTANCE.entityToItemResponse(item,
                    appConfig.getToggleDeadline()));
        }
    }


    private void validateLimit(String projectKey) {
        long total = toggleRepository.countByProjectKey(projectKey);
        FPUser user = new FPUser(String.valueOf(TokenHelper.getUserId()));
        user.with("account", TokenHelper.getAccount());
        double limitNum = SpringBeanManager.getBeanByType(FeatureProbe.class)
                .numberValue(LIMITER_TOGGLE_KEY, user, -1);
        if (limitNum > 0 && total >= limitNum) {
            throw new ResourceOverflowException(ResourceType.TOGGLE);
        }
    }

    protected Toggle createToggle(String projectKey, ToggleCreateRequest createRequest) {
        Toggle toggle = ToggleMapper.INSTANCE.requestToEntity(createRequest);
        toggle.setProjectKey(projectKey);
        setToggleTagRefs(toggle, createRequest.getTags());
        return toggleRepository.save(toggle);
    }

    private void createDefaultTargetingEntities(String projectKey, Toggle toggle) {
        List<Environment> environments = environmentRepository.findAllByProjectKey(projectKey);
        if (CollectionUtils.isEmpty(environments)) {
            log.info("{} environment is empty, ignore create targeting", projectKey);
            return;
        }
        List<Targeting> targetingList = environments.stream().map(environment ->
                createDefaultTargeting(toggle, environment)).collect(Collectors.toList());
        List<Targeting> savedTargetingList = targetingRepository.saveAll(targetingList);
        for (Targeting targeting : savedTargetingList) {
            saveTargetingVersion(buildTargetingVersion(targeting, ""));
            saveVariationHistory(targeting);
        }
    }

    private void saveTargetingVersion(TargetingVersion targetingVersion) {
        targetingVersionRepository.save(targetingVersion);
    }

    private void saveVariationHistory(Targeting targeting) {
        List<Variation> variations = JsonMapper.toObject(targeting.getContent(), TargetingContent.class)
                .getVariations();

        List<VariationHistory> variationHistories = IntStream.range(0, variations.size())
                .mapToObj(index -> convertVariationToEntity(targeting, index,
                        variations.get(index)))
                .collect(Collectors.toList());
        variationHistoryRepository.saveAll(variationHistories);
    }

    private void validateName(String projectKey, String name) {
        if (toggleRepository.existsByProjectKeyAndName(projectKey, name)) {
            throw new ResourceConflictException(ResourceType.TOGGLE);
        }
    }

    private void setToggleTagRefs(Toggle toggle, List<String> tagNames) {
        Set<Tag> tags = tagRepository.findByProjectKeyAndNameIn(toggle.getProjectKey(), tagNames);
        toggle.setTags(tags);
    }

    private VariationHistory convertVariationToEntity(Targeting targeting, int index, Variation variation) {
        VariationHistory variationHistory = new VariationHistory();
        variationHistory.setEnvironmentKey(targeting.getEnvironmentKey());
        variationHistory.setProjectKey(targeting.getProjectKey());
        variationHistory.setToggleKey(targeting.getToggleKey());
        variationHistory.setValue(variation.getValue());
        variationHistory.setName(variation.getName());
        variationHistory.setToggleVersion(targeting.getVersion());
        variationHistory.setValueIndex(index);
        return variationHistory;
    }

    private TargetingVersion buildTargetingVersion(Targeting targeting, String comment) {
        TargetingVersion targetingVersion = new TargetingVersion();
        targetingVersion.setProjectKey(targeting.getProjectKey());
        targetingVersion.setEnvironmentKey(targeting.getEnvironmentKey());
        targetingVersion.setToggleKey(targeting.getToggleKey());
        targetingVersion.setContent(targeting.getContent());
        targetingVersion.setDisabled(targeting.isDisabled());
        targetingVersion.setVersion(targeting.getVersion());
        targetingVersion.setComment(comment);
        return targetingVersion;
    }

    private Targeting createDefaultTargeting(Toggle toggle, Environment environment) {
        Targeting targeting = new Targeting();
        targeting.setDeleted(false);
        targeting.setVersion(1L);
        targeting.setProjectKey(toggle.getProjectKey());
        targeting.setDisabled(true);
        targeting.setContent(TargetingContent.newDefault(toggle.getVariations(),
                toggle.getDisabledServe()).toJson());
        targeting.setToggleKey(toggle.getKey());
        targeting.setEnvironmentKey(environment.getKey());
        targeting.setPublishTime(new Date());
        return targeting;
    }

    private Map<String, Set<String>> queryTagMap(List<String> toggleKeys) {
        List<ToggleTagRelation> toggleTags = toggleTagRepository.findByToggleKeyIn(toggleKeys);
        Set<Long> tagIds = toggleTags.stream().map(ToggleTagRelation::getTagId).collect(Collectors.toSet());
        List<Tag> tags = tagRepository.findAllById(tagIds);
        Map<Long, String> tagMap = tags.stream().collect(Collectors.toMap(Tag::getId, Tag::getName));
        Map<String, Set<String>> res = new HashMap<>(10);
        toggleTags.stream().forEach(toggleTag -> {
            if (res.containsKey(toggleTag.getToggleKey())) {
                res.get(toggleTag.getToggleKey()).add(tagMap.get(toggleTag.getTagId()));
            } else {
                res.put(toggleTag.getToggleKey(), new HashSet<>(Arrays.asList(tagMap.get(toggleTag.getTagId()))));
            }
        });
        return res;
    }

    private Map<String, TargetingSketch> queryNewestTargetingSketchMap(String projectKey, String environmentKey,
                                                                       List<String> toggleKeys) {
        List<TargetingSketch> targetingSketches = targetingSketchRepository
                .findByProjectKeyAndEnvironmentKeyAndStatusAndToggleKeyIn(projectKey, environmentKey,
                        SketchStatusEnum.PENDING, toggleKeys);
        return targetingSketches.stream().collect(Collectors.toMap(TargetingSketch::uniqueKey, Function.identity()));
    }

    private Map<String, Targeting> queryTargetingMap(String projectKey, String environmentKey,
                                                     List<String> toggleKeys) {
        List<Targeting> targetingList = targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(projectKey,
                environmentKey, toggleKeys);
        return targetingList.stream().collect(Collectors.toMap(Targeting::uniqueKey, Function.identity()));
    }

    private Page<Toggle> compoundQuery(String projectKey, ToggleSearchRequest searchRequest, Set<String> toggleKeys,
                                       boolean isPrecondition) {
        Specification<Toggle> resultSpec = (root, query, cb) -> {
            List<Predicate> predicateListAnd = new ArrayList<>();
            List<Predicate> predicateListOr = new ArrayList<>();
            predicateListAnd.add(cb.equal(root.get("projectKey"), projectKey));
            if (searchRequest.isArchived()) {
                predicateListAnd.add(cb.equal(root.get("archived"), Boolean.TRUE));
            } else {
                predicateListAnd.add(cb.equal(root.get("archived"), Boolean.FALSE));
            }
            if (StringUtils.isNotBlank(searchRequest.getKeyword())) {
                predicateListOr.add(cb.like(root.get("name"), "%" + searchRequest.getKeyword() + "%"));
                predicateListOr.add(cb.like(root.get("key"), "%" + searchRequest.getKeyword() + "%"));
                predicateListOr.add(cb.like(root.get("desc"), "%" + searchRequest.getKeyword() + "%"));
            }
            if (isPrecondition) {
                predicateListAnd.add(root.get("key").in(toggleKeys));
            }
            if (!Objects.isNull(searchRequest.getPermanent())) {
                predicateListAnd.add(cb.equal(root.get("permanent"), searchRequest.getPermanent()));
            }
            if (predicateListOr.size() > 0) {
                return query.where(cb.and(predicateListAnd.toArray(new Predicate[predicateListAnd.size()])),
                        cb.or(predicateListOr.toArray(new Predicate[predicateListOr.size()]))).getRestriction();
            }
            return query.where(cb.and(predicateListAnd.toArray(new Predicate[predicateListAnd.size()])))
                    .getRestriction();
        };
        Pageable pageable = PageRequest.of(searchRequest.getPageIndex(), searchRequest.getPageSize(),
                Sort.Direction.DESC, "createdTime");
        return toggleRepository.findAll(resultSpec, pageable);
    }

    private void retainAllKeys(Set<String> keys, Set<String> targets) {
        if (keys.isEmpty()) {
            keys.addAll(targets);
        } else {
            keys.retainAll(targets);
        }
    }

    private Set<String> queryToggleKeysByDisabled(String projectKey, String environmentKey, Boolean disabled) {
        List<Targeting> targetingList = targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndDisabled(projectKey,
                environmentKey, disabled);
        return targetingList.stream().map(Targeting::getToggleKey).collect(Collectors.toSet());
    }

    private Set<String> queryToggleKeysByReleaseStatus(String projectKey, String environmentKey,
                                                       List<ToggleReleaseStatusEnum> statusList) {
        List<Targeting> targetingList = targetingRepository.findAllByProjectKeyAndEnvironmentKeyAndStatusIn(projectKey,
                environmentKey, statusList);
        return targetingList.stream().map(Targeting::getToggleKey).collect(Collectors.toSet());
    }

    private Set<String> queryToggleKeysByTags(List<String> tagNames) {
        List<Tag> tags = tagRepository.findByNameIn(tagNames);
        Set<Long> tagIds = tags.stream().map(Tag::getId).collect(Collectors.toSet());
        List<ToggleTagRelation> toggleTags = toggleTagRepository.findByTagIdIn(tagIds);
        return toggleTags.stream().map(ToggleTagRelation::getToggleKey).collect(Collectors.toSet());
    }

    private Set<String> queryToggleKeysByVisited(VisitFilter visitFilter, String projectKey, Environment environment) {
        switch (visitFilter) {
            case IN_WEEK_VISITED:
                return weekVisitedToggleKeys(environment);
            case OUT_WEEK_VISITED:
                return lastVisitBeforeWeekToggleKeys(environment);
            case NOT_VISITED:
                return neverVisited(projectKey, environment);
            default:
                return new HashSet();
        }
    }

    private Set<String> allVisitedToggleKeys(Environment environment) {
        return eventRepository.findAllAccessedToggleKey(environment.getServerSdkKey(), environment.getClientSdkKey());
    }

    private Set<String> weekVisitedToggleKeys(Environment environment) {
        Date lastWeek = Date.from(LocalDateTime.now().minusDays(7).atZone(ZoneId.systemDefault()).toInstant());
        return eventRepository.findAllAccessedToggleKeyGreaterThanOrEqualToEndDate(
                environment.getServerSdkKey(), environment.getClientSdkKey(), lastWeek);
    }

    private Set<String> lastVisitBeforeWeekToggleKeys(Environment environment) {
        Set<String> allVisitedKeys = allVisitedToggleKeys(environment);
        Set<String> weekVisitedKeys = weekVisitedToggleKeys(environment);
        allVisitedKeys.removeAll(weekVisitedKeys);
        return allVisitedKeys;
    }

    private Set<String> neverVisited(String projectKey, Environment environment) {
        Set<String> allVisitedKeys = allVisitedToggleKeys(environment);
        Specification<Toggle> notSpec = (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("projectKey"), projectKey);
            Predicate p2 = root.get("key").in(allVisitedKeys).not();
            return query.where(cb.and(p1, p2)).getRestriction();
        };
        List<Toggle> toggles = toggleRepository.findAll(notSpec);
        return toggles.stream().map(Toggle::getKey).collect(Collectors.toSet());
    }

    private ToggleItemResponse entityToItemResponse(Toggle toggle, String projectKey, String environmentKey,
                                                    Map<String, Targeting> targetingMap,
                                                    Map<String, TargetingSketch> targetingSketchMap,
                                                    Map<String, MetricsCache> metricsCacheMap,
                                                    Map<String, Set<String>> tagMap) {
        ToggleItemResponse toggleItem = ToggleMapper.INSTANCE.entityToItemResponse(toggle,
                appConfig.getToggleDeadline());
        toggleItem.setTags(tagMap.get(toggle.getKey()));
        toggleItem.setDisabled(targetingMap.get(uniqueKey(projectKey, environmentKey, toggle.getKey())).isDisabled());
        toggleItem.setReleaseStatus(targetingMap.get(uniqueKey(projectKey, environmentKey, toggle.getKey()))
                .getStatus());
        if (ObjectUtils.isNotEmpty(metricsCacheMap.get(toggle.getKey()))) {
            toggleItem.setVisitedTime(metricsCacheMap.get(toggle.getKey()).getStartDate());
        }
        TargetingSketch sketch = targetingSketchMap.get(uniqueKey(projectKey, environmentKey, toggle.getKey()));
        if (ObjectUtils.isNotEmpty(sketch)) {
            toggleItem.setLocked(locked(sketch));
            toggleItem.setLockedBy(sketch.getCreatedBy().getAccount());
            toggleItem.setLockedTime(sketch.getCreatedTime());
        }
        return toggleItem;
    }

    private String uniqueKey(String projectKey, String environmentKey, String toggleKey) {
        return projectKey + "&" + environmentKey + "&" + toggleKey;
    }

    private boolean locked(TargetingSketch targetingSketch) {
        return targetingSketch.getStatus() == SketchStatusEnum.PENDING;
    }

    private Map<String, MetricsCache> queryMetricsCacheMap(String projectKey, String environmentKey,
                                                           List<String> toggleKeys) {
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey).get();
        Specification<MetricsCache> spec = (root, query, cb) -> {
            Predicate p0 = root.get("toggleKey").in(toggleKeys);
            Predicate p1 = cb.equal(root.get("sdkKey"), environment.getServerSdkKey());
            Predicate p2 = cb.equal(root.get("sdkKey"), environment.getClientSdkKey());
            Predicate p3 = cb.equal(root.get("type"), MetricsCacheTypeEnum.EVALUATION);
            return query.where(cb.and(p0, p3), cb.or(p1, p2)).getRestriction();
        };
        List<MetricsCache> metricsCaches = metricsCacheRepository.findAll(spec);
        return metricsCaches.stream().collect(Collectors.toMap(MetricsCache::getToggleKey, Function.identity()));
    }

    @Archived
    public ToggleResponse queryByKey(String projectKey, String toggleKey) {
        Toggle toggle = toggleRepository.findByProjectKeyAndKey(projectKey, toggleKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.TOGGLE, toggleKey));
        return ToggleMapper.INSTANCE.entityToResponse(toggle, appConfig.getToggleDeadline());
    }

}
