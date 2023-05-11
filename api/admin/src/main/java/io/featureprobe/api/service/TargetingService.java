package io.featureprobe.api.service;

import io.featureprobe.api.auth.TokenHelper;
import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.featureprobe.api.base.model.BaseRule;
import io.featureprobe.api.base.model.PrerequisiteModel;
import io.featureprobe.api.base.model.SegmentRuleModel;
import io.featureprobe.api.base.model.TargetingContent;
import io.featureprobe.api.base.model.ToggleRule;
import io.featureprobe.api.base.model.Variation;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.base.util.ToggleContentLimitChecker;
import io.featureprobe.api.config.AppConfig;
import io.featureprobe.api.dao.entity.Prerequisite;
import io.featureprobe.api.dao.entity.Segment;
import io.featureprobe.api.dao.entity.Toggle;
import io.featureprobe.api.dao.entity.ToggleControlConf;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.PrerequisiteRepository;
import io.featureprobe.api.dao.repository.ToggleRepository;
import io.featureprobe.api.dao.utils.PageRequestUtil;
import io.featureprobe.api.dto.AfterTargetingVersionResponse;
import io.featureprobe.api.dto.ApprovalResponse;
import io.featureprobe.api.dto.CancelSketchRequest;
import io.featureprobe.api.dto.DependentToggleRequest;
import io.featureprobe.api.dto.DependentToggleResponse;
import io.featureprobe.api.dto.PrerequisiteToggleRequest;
import io.featureprobe.api.dto.PrerequisiteToggleResponse;
import io.featureprobe.api.dto.TargetingApprovalRequest;
import io.featureprobe.api.dto.TargetingDiffResponse;
import io.featureprobe.api.dto.TargetingPublishRequest;
import io.featureprobe.api.dto.TargetingResponse;
import io.featureprobe.api.dto.TargetingVersionRequest;
import io.featureprobe.api.dto.TargetingVersionResponse;
import io.featureprobe.api.dto.ToggleControlConfRequest;
import io.featureprobe.api.dto.UpdateApprovalStatusRequest;
import io.featureprobe.api.dao.entity.ApprovalRecord;
import io.featureprobe.api.dao.entity.Environment;
import io.featureprobe.api.dao.entity.Targeting;
import io.featureprobe.api.dao.entity.TargetingSegment;
import io.featureprobe.api.dao.entity.TargetingSketch;
import io.featureprobe.api.dao.entity.TargetingVersion;
import io.featureprobe.api.dao.entity.VariationHistory;
import io.featureprobe.api.base.enums.ApprovalStatusEnum;
import io.featureprobe.api.base.enums.ChangeLogType;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.enums.SketchStatusEnum;
import io.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import io.featureprobe.api.mapper.ApprovalRecordMapper;
import io.featureprobe.api.mapper.TargetingMapper;
import io.featureprobe.api.mapper.TargetingVersionMapper;
import io.featureprobe.api.base.model.ConditionValue;
import io.featureprobe.api.base.model.PaginationRequest;
import io.featureprobe.api.dao.repository.ApprovalRecordRepository;
import io.featureprobe.api.dao.repository.EnvironmentRepository;
import io.featureprobe.api.dao.repository.SegmentRepository;
import io.featureprobe.api.dao.repository.TargetingRepository;
import io.featureprobe.api.dao.repository.TargetingSegmentRepository;
import io.featureprobe.api.dao.repository.TargetingSketchRepository;
import io.featureprobe.api.dao.repository.TargetingVersionRepository;
import io.featureprobe.api.dao.repository.VariationHistoryRepository;
import io.featureprobe.api.base.util.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import javax.persistence.EntityManager;
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@AllArgsConstructor
@Service
public class TargetingService {

    private static final Pattern dateTimeRegex = Pattern.compile("[0-9]{3}[0-9]-[0-1][0-9]-[0-3][0-9]T[0-2][0-9]" +
            "(:[0-6][0-9]){2}\\+[0-2][0-9]:[0-1][0-9]");

    private static final Pattern versionRegex = Pattern.compile("^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)" +
            "(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))" +
            "?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$");

    private TargetingRepository targetingRepository;

    private SegmentRepository segmentRepository;

    private TargetingSegmentRepository targetingSegmentRepository;

    private TargetingVersionRepository targetingVersionRepository;

    private VariationHistoryRepository variationHistoryRepository;

    private EnvironmentRepository environmentRepository;

    private ApprovalRecordRepository approvalRecordRepository;

    private TargetingSketchRepository targetingSketchRepository;

    private ToggleRepository toggleRepository;

    private PrerequisiteRepository prerequisiteRepository;

    private ChangeLogService changeLogService;

    private ToggleControlConfService toggleControlConfService;

    private MetricService metricService;

    private AppConfig appConfig;

    @PersistenceContext
    public EntityManager entityManager;

    @Transactional(rollbackFor = Exception.class)
    public TargetingResponse publish(String projectKey, String environmentKey, String toggleKey,
                                     TargetingPublishRequest targetingPublishRequest) {

        if (Objects.nonNull(targetingPublishRequest.getContent())) {
            List<PrerequisiteModel> prerequisites = targetingPublishRequest.getContent().getPrerequisites();
            if (!CollectionUtils.isEmpty(prerequisites)){
                if (hasDependencyCycle(projectKey, environmentKey, toggleKey, new HashSet<>(prerequisites),
                        appConfig.getMaximumDependencyDepth())) {
                    throw new IllegalArgumentException("validate.prerequisite.dependency.cycle");
                }
                updateDependentToggles(projectKey, environmentKey, toggleKey, prerequisites);
            }
        }

        Environment environment = selectEnvironment(projectKey, environmentKey);
        TargetingResponse response = publishTargeting(projectKey, environmentKey, toggleKey,
                targetingPublishRequest, null);
        changeLogService.create(environment, ChangeLogType.CHANGE);
        return response;
    }

    @Transactional(rollbackFor = Exception.class)
    public ApprovalResponse approval(String projectKey, String environmentKey, String toggleKey,
                                     TargetingApprovalRequest approvalRequest) {
        validateTargetingContent(projectKey, approvalRequest.getContent());
        List<PrerequisiteModel> prerequisites = approvalRequest.getContent().getPrerequisites();
        if (!CollectionUtils.isEmpty(prerequisites) &&
                hasDependencyCycle(projectKey, environmentKey, toggleKey, new HashSet<>(prerequisites),
                appConfig.getMaximumDependencyDepth())){
            throw new IllegalArgumentException("validate.prerequisite.dependency.cycle");
        }
        Environment environment = selectEnvironment(projectKey, environmentKey);
        if (environment.isEnableApproval()) {
            List<String> reviews = JsonMapper.toListObject(environment.getReviewers(), String.class);
            approvalRequest.setReviewers(reviews);
            Targeting targeting = selectTargeting(projectKey, environmentKey, toggleKey);
            if (targeting.getStatus() == ToggleReleaseStatusEnum.PENDING_APPROVAL) {
                throw new IllegalArgumentException("validate.approval.repeat");
            }
            targeting.setStatus(ToggleReleaseStatusEnum.PENDING_APPROVAL);
            targetingRepository.save(targeting);
            ApprovalRecord approvalRecord = submitApproval(projectKey, environmentKey,
                    toggleKey, approvalRequest);
            Targeting approval = new Targeting();
            approval.setDisabled(approvalRequest.getDisabled());
            approval.setContent(JsonMapper.toJSONString(approvalRequest.getContent()));
            return buildApprovalResponse(approvalRecord, targeting, approval);
        }
        throw new IllegalArgumentException("validate.approval.disable");
    }

    private void updateDependentToggles(String projectKey, String environmentKey, String toggleKey,
                                        List<PrerequisiteModel> prerequisiteModels) {
        prerequisiteRepository.deleteAllByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey,
                toggleKey);
        List<Prerequisite> prerequisites = prerequisiteModels.stream().map(prerequisiteModel ->
                buildPrerequisite(projectKey, environmentKey, toggleKey, prerequisiteModel))
                .collect(Collectors.toList());
        prerequisiteRepository.saveAll(prerequisites);
    }

    private Prerequisite buildPrerequisite(String projectKey, String environmentKey, String toggleKey,
                                           PrerequisiteModel prerequisiteModel) {
        Prerequisite prerequisite = new Prerequisite();
        prerequisite.setProjectKey(projectKey);
        prerequisite.setEnvironmentKey(environmentKey);
        prerequisite.setToggleKey(toggleKey);
        prerequisite.setParentToggleKey(prerequisiteModel.getKey());
        prerequisite.setDependentValue(prerequisiteModel.getValue());
        return prerequisite;
    }

    private ApprovalResponse buildApprovalResponse(ApprovalRecord approvalRecord, Targeting currentData,
                                                   Targeting approvalData) {
        ApprovalResponse approvalResponse = ApprovalRecordMapper.INSTANCE.entityToApprovalResponse(approvalRecord);
        Map<String, Object> current = new HashMap<>();
        current.put("disabled", currentData.isDisabled());
        current.put("content", currentData.getContent());
        approvalResponse.setCurrentData(current);
        Map<String, Object> approval = new HashMap<>();
        approval.put("disabled", approvalData.isDisabled());
        approval.put("content", approvalData.getContent());
        approvalResponse.setApprovalData(approval);
        return approvalResponse;
    }

    private boolean hasDependencyCycle(String projectKey, String environmentKey , String rootToggleKey,
                                       Set<PrerequisiteModel> parentPrerequisites, int deep) {
        if (deep == 0) {
            throw new IllegalArgumentException("validate.prerequisite.deep.limit");
        }
        if (CollectionUtils.isEmpty(parentPrerequisites)) {
            return false;
        }
        Set<String> parentToggleKeys = parentPrerequisites.stream().map(PrerequisiteModel::getKey)
                .collect(Collectors.toSet());
        if (parentToggleKeys.contains(rootToggleKey)) {
            return true;
        }
        List<Targeting> targetingList = targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(projectKey,
                environmentKey, parentToggleKeys);
        Set<PrerequisiteModel> prerequisite = targetingList.stream()
                .map(Targeting::getContent).map(content -> JsonMapper.toObject(content, TargetingContent.class)
                        .getPrerequisites()).filter(Objects::nonNull)
                .flatMap(List::stream).collect(Collectors.toSet());
        return  hasDependencyCycle(projectKey, environmentKey, rootToggleKey, prerequisite, deep - 1);
    }

    @Transactional(rollbackFor = Exception.class)
    public TargetingResponse publishSketch(String projectKey, String environmentKey, String toggleKey,
                                           ToggleControlConfRequest controlConfRequest) {
        Optional<ApprovalRecord> approvalRecordOptional = queryNewestApprovalRecord(projectKey,
                environmentKey, toggleKey);
        Optional<TargetingSketch> targetingSketchOptional = queryNewestTargetingSketch(projectKey, environmentKey,
                toggleKey);
        Environment environment = selectEnvironment(projectKey, environmentKey);
        if (approvalRecordOptional.isPresent() && targetingSketchOptional.isPresent() &&
                publishableStatus(approvalRecordOptional.get())) {
            TargetingSketch sketch = targetingSketchOptional.get();
            sketch.setStatus(SketchStatusEnum.RELEASE);
            targetingSketchRepository.save(sketch);
            TargetingPublishRequest targetingPublishRequest = new TargetingPublishRequest(
                    JsonMapper.toObject(sketch.getContent(), TargetingContent.class),
                    sketch.getComment(), sketch.getDisabled(), controlConfRequest);
            changeLogService.create(environment, ChangeLogType.CHANGE);
            return publishTargeting(projectKey, environmentKey, toggleKey, targetingPublishRequest,
                    approvalRecordOptional.get().getId());
        }
        return null;
    }

    @Transactional(rollbackFor = Exception.class)
    public TargetingResponse cancelSketch(String projectKey, String environmentKey, String toggleKey,
                                          CancelSketchRequest cancelSketchRequest) {
        Optional<ApprovalRecord> approvalRecordOptional = queryNewestApprovalRecord(projectKey,
                environmentKey, toggleKey);
        Optional<TargetingSketch> targetingSketchOptional = queryNewestTargetingSketch(projectKey, environmentKey,
                toggleKey);
        Targeting targeting = selectTargeting(projectKey, environmentKey, toggleKey);
        if (approvalRecordOptional.isPresent() && targetingSketchOptional.isPresent()) {
            TargetingSketch sketch = targetingSketchOptional.get();
            sketch.setStatus(SketchStatusEnum.CANCEL);
            sketch.setComment(cancelSketchRequest.getComment());
            targeting.setStatus(ToggleReleaseStatusEnum.RELEASE);
            targetingSketchRepository.save(sketch);
            Targeting save = targetingRepository.save(targeting);
            return TargetingMapper.INSTANCE.entityToResponse(save);
        }
        return null;
    }

    @Transactional(rollbackFor = Exception.class)
    public ApprovalResponse updateApprovalStatus(String projectKey, String environmentKey, String toggleKey,
                                                 UpdateApprovalStatusRequest updateRequest) {
        Optional<ApprovalRecord> approvalRecordOptional = queryNewestApprovalRecord(projectKey,
                environmentKey, toggleKey);
        Optional<TargetingSketch> targetingSketchOptional = queryNewestTargetingSketch(projectKey, environmentKey,
                toggleKey);
        Targeting targeting = selectTargeting(projectKey, environmentKey, toggleKey);
        if (approvalRecordOptional.isPresent() && targetingSketchOptional.isPresent() &&
                checkStateMachine(approvalRecordOptional.get(), updateRequest.getStatus())) {

            if (updateRequest.getStatus() == ApprovalStatusEnum.REVOKE) {
                TargetingSketch sketch = targetingSketchOptional.get();
                sketch.setStatus(SketchStatusEnum.REVOKE);
                targetingSketchRepository.save(sketch);
            }
            ApprovalRecord approvalRecord = approvalRecordOptional.get();
            approvalRecord.setStatus(updateRequest.getStatus());
            approvalRecord.setComment(updateRequest.getComment());
            approvalRecord.setApprovedBy(TokenHelper.getAccount());
            approvalRecordRepository.saveAndFlush(approvalRecord);
            if (updateRequest.getStatus() == ApprovalStatusEnum.JUMP) {
                publishSketch(projectKey, environmentKey, toggleKey, updateRequest);
            }
            if (updateRequest.getStatus() == ApprovalStatusEnum.PASS) {
                targeting.setStatus(ToggleReleaseStatusEnum.PENDING_RELEASE);
            } else if (updateRequest.getStatus() == ApprovalStatusEnum.REJECT) {
                targeting.setStatus(ToggleReleaseStatusEnum.REJECT);
            } else {
                targeting.setStatus(ToggleReleaseStatusEnum.RELEASE);
            }
            Targeting current = targetingRepository.save(targeting);
            Targeting approval = new Targeting();
            approval.setDisabled(targetingSketchOptional.get().getDisabled());
            approval.setContent(targetingSketchOptional.get().getContent());
            return buildApprovalResponse(approvalRecord, current, approval);
        }
        throw new IllegalArgumentException();
    }

    private boolean checkStateMachine(ApprovalRecord approvalRecord, ApprovalStatusEnum status) {
        switch (status) {
            case PASS:
            case REJECT:
                return approvalRecord.getStatus() == ApprovalStatusEnum.PENDING &&
                        JsonMapper.toListObject(approvalRecord.getReviewers(), String.class)
                                .contains(TokenHelper.getAccount());
            case REVOKE:
            case JUMP:
                return approvalRecord.getStatus() == ApprovalStatusEnum.PENDING &&
                        TenantContext.getCurrentOrganization().getRole() == OrganizationRoleEnum.OWNER;
            default:
                return false;
        }
    }

    public Page<TargetingVersionResponse> queryVersions(String projectKey, String environmentKey, String toggleKey,
                                                        TargetingVersionRequest targetingVersionRequest) {
        Page<TargetingVersion> targetingVersions;
        if (Objects.isNull(targetingVersionRequest.getVersion())) {
            targetingVersions = targetingVersionRepository
                    .findAllByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey,
                            PageRequestUtil.toCreatedTimeDescSortPageable(targetingVersionRequest));
        } else {
            targetingVersions = targetingVersionRepository
                    .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndVersionLessThanOrderByVersionDesc(
                            projectKey, environmentKey, toggleKey, targetingVersionRequest.getVersion(),
                            PageRequestUtil.toCreatedTimeDescSortPageable(targetingVersionRequest));
        }
        return targetingVersions.map(targetingVersion -> translateTargetingVersionResponse(targetingVersion));
    }

    public AfterTargetingVersionResponse queryAfterVersion(String projectKey, String environmentKey, String toggleKey,
                                                           Long version) {
        List<TargetingVersion> targetingVersions = targetingVersionRepository
                .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndVersionGreaterThanEqualOrderByVersionDesc(
                        projectKey, environmentKey, toggleKey, version);
        List<TargetingVersionResponse> versions = targetingVersions.stream().map(targetingVersion ->
                translateTargetingVersionResponse(targetingVersion)).collect(Collectors.toList());
        long total = targetingVersionRepository.countByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey);
        return new AfterTargetingVersionResponse(total, versions);
    }

    private TargetingVersionResponse translateTargetingVersionResponse(TargetingVersion targetingVersion) {
        TargetingVersionResponse targetingVersionResponse = TargetingVersionMapper.INSTANCE
                .entityToResponse(targetingVersion);
        if (Objects.nonNull(targetingVersion.getApprovalId())) {
            Optional<ApprovalRecord> approvalRecord = approvalRecordRepository
                    .findById(targetingVersion.getApprovalId());
            targetingVersionResponse.setApprovalStatus(approvalRecord.get().getStatus());
            targetingVersionResponse.setApprovalTime(approvalRecord.get().getModifiedTime());
            targetingVersionResponse.setApprovalBy(approvalRecord.get().getApprovedBy());
            targetingVersionResponse.setApprovalComment(approvalRecord.get().getComment());
        }
        return targetingVersionResponse;
    }

    public TargetingDiffResponse diff(String projectKey, String environmentKey, String toggleKey) {
        TargetingDiffResponse diffResponse = new TargetingDiffResponse();
        Optional<TargetingSketch> targetingSketch = queryNewestTargetingSketch(projectKey, environmentKey, toggleKey);
        Optional<Targeting> targeting = targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey);
        if (targetingSketch.isPresent() && targeting.isPresent()) {
            diffResponse.setCurrentDisabled(targetingSketch.get().getDisabled());
            diffResponse.setCurrentContent(JsonMapper.toObject(targetingSketch.get().getContent(),
                    TargetingContent.class));
            diffResponse.setOldDisabled(targeting.get().isDisabled());
            diffResponse.setOldContent(JsonMapper.toObject(targeting.get().getContent(), TargetingContent.class));
        }
        return diffResponse;
    }

    public TargetingResponse queryByKey(String projectKey, String environmentKey, String toggleKey) {
        Environment environment = selectEnvironment(projectKey, environmentKey);
        Targeting targeting = targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey).get();
        TargetingResponse targetingResponse = TargetingMapper.INSTANCE.entityToResponse(targeting);
        Optional<ApprovalRecord> newestApprovalRecord = queryNewestApprovalRecord(projectKey, environmentKey,
                toggleKey);
        Optional<TargetingSketch> targetingSketch = queryNewestTargetingSketch(projectKey, environmentKey, toggleKey);
        if (newestApprovalRecord.isPresent() && targetingSketch.isPresent() && locked(targetingSketch.get())) {
            targetingResponse.setContent(JsonMapper.toObject(targetingSketch.get().getContent(),
                    TargetingContent.class));
            targetingResponse.setDisabled(targetingSketch.get().getDisabled());
            targetingResponse.setVersion(targetingSketch.get().getOldVersion() + 1);
            targetingResponse.setStatus(newestApprovalRecord.get().getStatus().name());
            targetingResponse.setReviewers(JsonMapper.toListObject(newestApprovalRecord.get().getReviewers(),
                    String.class));
            targetingResponse.setSubmitBy(newestApprovalRecord.get().getSubmitBy());
            targetingResponse.setApprovalBy(newestApprovalRecord.get().getApprovedBy());
            targetingResponse.setApprovalComment(newestApprovalRecord.get().getComment());
            targetingResponse.setLocked(true);
            targetingResponse.setLockedTime(newestApprovalRecord.get().getCreatedTime());
        } else {
            targetingResponse.setStatus(SketchStatusEnum.RELEASE.name());
            if (environment.isEnableApproval()) {
                targetingResponse.setReviewers(JsonMapper.toListObject(environment.getReviewers(), String.class));
            }
        }
        targetingResponse.setEnableApproval(environment.isEnableApproval());
        targetingResponse.setPublishTime(targeting.getPublishTime());

        Boolean trackAccessEvents = toggleControlConfService.queryToggleControlConf(targeting)
                .isTrackAccessEvents();
        targetingResponse.setTrackAccessEvents(trackAccessEvents);
        targetingResponse.setAllowEnableTrackAccessEvents(BooleanUtils.isFalse(trackAccessEvents)
                && metricService.existsMetric(targeting.getProjectKey(),
                targeting.getEnvironmentKey(),
                targeting.getToggleKey()));
        if (Objects.isNull(targetingResponse.getContent().getPrerequisites())) {
            targetingResponse.getContent().setPrerequisites(Collections.emptyList());
        }
        return targetingResponse;
    }

    private boolean locked(TargetingSketch targetingSketch) {
        return targetingSketch.getStatus() == SketchStatusEnum.PENDING;
    }

    private boolean publishableStatus(ApprovalRecord approvalRecord) {
        return approvalRecord.getStatus() == ApprovalStatusEnum.JUMP ||
                approvalRecord.getStatus() == ApprovalStatusEnum.PASS;
    }

    private ApprovalRecord submitApproval(String projectKey, String environmentKey, String toggleKey,
                                          TargetingApprovalRequest approvalRequest) {
        Targeting targeting = selectTargeting(projectKey, environmentKey, toggleKey);
        ApprovalRecord approvalRecord = approvalRecordRepository.save(buildApprovalRecord(projectKey, environmentKey,
                toggleKey, approvalRequest));
        targetingSketchRepository.save(buildTargetingSketch(projectKey, environmentKey, toggleKey,
                approvalRecord.getId(), targeting.getVersion(), approvalRequest));
        return approvalRecord;
    }

    private TargetingResponse publishTargeting(String projectKey, String environmentKey, String toggleKey,
                                               TargetingPublishRequest targetingPublishRequest, Long approvalId) {
        Targeting latestTargeting = selectTargeting(projectKey, environmentKey, toggleKey);
        if (targetingPublishRequest.isUpdateTargetingRules()) {
            latestTargeting = updateTargeting(projectKey, latestTargeting, targetingPublishRequest);
            saveTargetingSegmentRefs(projectKey, latestTargeting, targetingPublishRequest.getContent());
            saveTargetingVersion(buildTargetingVersion(latestTargeting,
                    targetingPublishRequest.getComment(), approvalId));
            saveVariationHistory(latestTargeting, targetingPublishRequest.getContent());
            latestTargeting.setStatus(ToggleReleaseStatusEnum.RELEASE);
        }
        ToggleControlConf toggleControlConf = toggleControlConfService.updateTrackAccessEvents(latestTargeting,
                targetingPublishRequest.getTrackAccessEvents());

        TargetingResponse targetingResponse = TargetingMapper.INSTANCE.entityToResponse(latestTargeting);
        targetingResponse.setTrackAccessEvents(toggleControlConf.isTrackAccessEvents());

        return targetingResponse;
    }

    private ApprovalRecord buildApprovalRecord(String projectKey, String environmentKey, String toggleKey,
                                               TargetingApprovalRequest approvalRequest) {
        ApprovalRecord approvalRecord = new ApprovalRecord();
        approvalRecord.setProjectKey(projectKey);
        approvalRecord.setEnvironmentKey(environmentKey);
        approvalRecord.setToggleKey(toggleKey);
        approvalRecord.setTitle(approvalRequest.getComment());
        approvalRecord.setSubmitBy(TokenHelper.getAccount());
        approvalRecord.setReviewers(JsonMapper.toJSONString(approvalRequest.getReviewers()));
        approvalRecord.setStatus(ApprovalStatusEnum.PENDING);
        return approvalRecord;
    }

    private TargetingSketch buildTargetingSketch(String projectKey, String environmentKey, String toggleKey,
                                                 Long approvalId, Long oldVersion,
                                                 TargetingApprovalRequest approvalRequest) {
        TargetingSketch sketch = new TargetingSketch();
        sketch.setApprovalId(approvalId);
        sketch.setProjectKey(projectKey);
        sketch.setEnvironmentKey(environmentKey);
        sketch.setToggleKey(toggleKey);
        sketch.setOldVersion(oldVersion);
        sketch.setContent(JsonMapper.toJSONString(approvalRequest.getContent()));
        sketch.setComment(approvalRequest.getComment());
        sketch.setDisabled(approvalRequest.getDisabled());
        sketch.setStatus(SketchStatusEnum.PENDING);
        return sketch;
    }

    private Targeting updateTargeting(String projectKey, Targeting currentTargeting,
                                      TargetingPublishRequest updateTargetingPublishRequest) {
        TargetingContent currentTargetingContent = JsonMapper.toObject(currentTargeting.getContent(),
                TargetingContent.class);
        TargetingMapper.INSTANCE.mapContentEntity(updateTargetingPublishRequest.getContent(), currentTargetingContent);
        validatePublishConflicts(currentTargeting, updateTargetingPublishRequest.getBaseVersion());
        validateTargetingContent(projectKey, currentTargetingContent);

        updateTargetingPublishRequest.setContent(currentTargetingContent);
        TargetingMapper.INSTANCE.mapEntity(updateTargetingPublishRequest, currentTargeting);
        currentTargeting.setVersion(currentTargeting.getVersion() + 1);
        currentTargeting.setPublishTime(new Date());
        return targetingRepository.saveAndFlush(currentTargeting);
    }

    private TargetingVersion buildTargetingVersion(Targeting targeting, String comment, Long approvalId) {
        TargetingVersion targetingVersion = new TargetingVersion();
        targetingVersion.setProjectKey(targeting.getProjectKey());
        targetingVersion.setEnvironmentKey(targeting.getEnvironmentKey());
        targetingVersion.setToggleKey(targeting.getToggleKey());
        targetingVersion.setContent(targeting.getContent());
        targetingVersion.setDisabled(targeting.isDisabled());
        targetingVersion.setVersion(targeting.getVersion());
        targetingVersion.setComment(comment);
        targetingVersion.setApprovalId(approvalId);
        return targetingVersion;
    }

    @Transactional(rollbackFor = Exception.class)
    public void createDefaultTargetingEntities(String projectKey, Toggle toggle) {
        List<Environment> environments = environmentRepository.findAllByProjectKey(projectKey);
        if (org.apache.commons.collections4.CollectionUtils.isEmpty(environments)) {
            log.info("{} environment is empty, ignore create targeting", projectKey);
            return;
        }
        List<Targeting> targetingList = environments.stream()
                .map(environment -> createDefaultTargeting(toggle, environment)).collect(Collectors.toList());
        environments.stream().forEach(environment -> changeLogService.create(environment, ChangeLogType.CHANGE));
        this.createTargetingEntities(targetingList);
    }

    @Transactional(rollbackFor = Exception.class)
    public void createTargetingEntities(List<Targeting> targetingList) {
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

    private void saveTargetingSegmentRefs(String projectKey, Targeting targeting, TargetingContent targetingContent) {
        targetingSegmentRepository.deleteByTargetingId(targeting.getId());
        List<TargetingSegment> targetingSegmentList = getTargetingSegments(projectKey, targeting, targetingContent);
        if (!CollectionUtils.isEmpty(targetingSegmentList)) {
            targetingSegmentRepository.saveAll(targetingSegmentList);
        }
    }

    private List<TargetingSegment> getTargetingSegments(String projectKey, Targeting targeting,
                                                        TargetingContent targetingContent) {
        Set<String> segmentKeys = new TreeSet<>();
        targetingContent.getRules().forEach(toggleRule -> toggleRule.getConditions()
                .stream()
                .filter(ConditionValue::isSegmentType)
                .forEach(conditionValue -> segmentKeys.addAll(conditionValue.getObjects())));

        return segmentKeys.stream().map(segmentKey -> new TargetingSegment(targeting.getId(), segmentKey, projectKey))
                .collect(Collectors.toList());
    }

    private void saveVariationHistory(Targeting targeting,
                                      TargetingContent targetingContent) {
        List<Variation> variations = targetingContent.getVariations();
        List<VariationHistory> variationHistories = IntStream.range(0, targetingContent
                        .getVariations().size())
                .mapToObj(index -> convertVariationToEntity(targeting, index,
                        variations.get(index)))
                .collect(Collectors.toList());
        variationHistoryRepository.saveAll(variationHistories);
    }

    private Optional<ApprovalRecord> queryNewestApprovalRecord(String projectKey, String environmentKey,
                                                               String toggleKey) {
        Specification<ApprovalRecord> spec = (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("projectKey"), projectKey);
            Predicate p2 = cb.equal(root.get("environmentKey"), environmentKey);
            Predicate p3 = cb.equal(root.get("toggleKey"), toggleKey);
            return query.where(p1, p2, p3).getRestriction();
        };
        Pageable pageable = PageRequestUtil.toPageable(new PaginationRequest(), Sort.Direction.DESC,
                "createdTime");
        Page<ApprovalRecord> approvalRecords = approvalRecordRepository.findAll(spec, pageable);
        if (CollectionUtils.isEmpty(approvalRecords.getContent())) {
            return Optional.empty();
        }
        return Optional.of(approvalRecords.getContent().get(0));
    }

    private Optional<TargetingSketch> queryNewestTargetingSketch(String projectKey, String environmentKey,
                                                                 String toggleKey) {
        Specification<TargetingSketch> spec = (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("projectKey"), projectKey);
            Predicate p2 = cb.equal(root.get("environmentKey"), environmentKey);
            Predicate p3 = cb.equal(root.get("toggleKey"), toggleKey);
            return query.where(p1, p2, p3).getRestriction();
        };
        Pageable pageable = PageRequestUtil.toPageable(new PaginationRequest(), Sort.Direction.DESC,
                "createdTime");
        Page<TargetingSketch> targetingSketches = targetingSketchRepository.findAll(spec, pageable);
        if (CollectionUtils.isEmpty(targetingSketches.getContent())) {
            return Optional.empty();
        }
        return Optional.of(targetingSketches.getContent().get(0));
    }

    protected void validatePublishConflicts(Targeting targeting, Long baseVersion){
        if (baseVersion != null) {
            if (targeting.getVersion() != null && !targeting.getVersion().equals(baseVersion)) {
                throw new OptimisticLockException("publish conflict");
            }
        }
    }

    protected void validateTargetingContent(String projectKey, TargetingContent content) {
        if (Objects.isNull(content) && CollectionUtils.isEmpty(content.getRules())) {
            return;
        }
        ToggleContentLimitChecker.validateSize(content.toJson());

        content.getRules()
                .stream()
                .filter(BaseRule::isNotEmptyConditions)
                .forEach(toggleRule -> {
                    validateRuleRefSegmentExists(projectKey, toggleRule);
                    validateNumber(toggleRule);
                    validateDatetime(toggleRule);
                    validateSemVer(toggleRule);
                });
    }

    private void validateRuleRefSegmentExists(String projectKey, ToggleRule toggleRule) {
        toggleRule.getConditions().stream().filter(ConditionValue::isSegmentType)
                .forEach(conditionValue -> conditionValue.getObjects().stream().forEach(segmentKey -> {
                    if (!segmentRepository.existsByProjectKeyAndKey(projectKey, segmentKey)) {
                        throw new ResourceNotFoundException(ResourceType.SEGMENT, segmentKey);
                    }
                }));
    }

    private void validateNumber(ToggleRule toggleRule) {
        toggleRule.getConditions().stream().filter(ConditionValue::isNumberType)
                .forEach(conditionValue -> conditionValue.getObjects().stream().forEach(number -> {
                    try {
                        Double.parseDouble(number);
                    } catch (NumberFormatException e) {
                        throw new IllegalArgumentException("validate.number_format_error");
                    }
                }));
    }

    private void validateDatetime(ToggleRule toggleRule) {
        toggleRule.getConditions().stream().filter(ConditionValue::isDatetimeType)
                .forEach(conditionValue -> conditionValue.getObjects().stream().forEach(datetime -> {
                    if (!dateTimeRegex.matcher(datetime).matches()) {
                        throw new IllegalArgumentException("validate.datetime_format_error");
                    }
                }));
    }

    private void validateSemVer(ToggleRule toggleRule) {
        toggleRule.getConditions().stream().filter(ConditionValue::isSemVerType)
                .forEach(conditionValue -> conditionValue.getObjects().stream().forEach(semVer -> {
                    if (!versionRegex.matcher(semVer).matches()) {
                        throw new IllegalArgumentException("validate.version_format_error");
                    }
                }));
    }

    private Environment selectEnvironment(String projectKey, String environmentKey) {
        return environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.ENVIRONMENT, projectKey + "-" + environmentKey));
    }

    private Targeting selectTargeting(String projectKey, String environmentKey, String toggleKey) {
        return targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey,
                toggleKey).orElseThrow(() -> new ResourceNotFoundException(ResourceType.TARGETING,
                projectKey + "-" + environmentKey + "-" + toggleKey));
    }

    public List<String> attributes(String projectKey, String environmentKey, String toggleKey) {
        List<String> res = new ArrayList<>();
        Targeting targeting = targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey).orElseThrow(() -> new ResourceNotFoundException(ResourceType.TARGETING,
                projectKey + "-" + environmentKey + "-" + toggleKey));
        TargetingContent targetingContent = JsonMapper.toObject(targeting.getContent(), TargetingContent.class);
        List<ToggleRule> rules = targetingContent.getRules();
        if (CollectionUtils.isEmpty(rules)) return res;
        for (ToggleRule rule : rules) {
            List<ConditionValue> conditions = rule.getConditions();
            if (CollectionUtils.isEmpty(conditions)) {
                break;
            }
            for (ConditionValue condition : conditions) {
                if ("segment".equals(condition.getType())) {
                    res.addAll(getSegmentAttributes(projectKey, condition.getObjects()));
                } else {
                    res.add(condition.getSubject());
                }
            }
        }
        return res.stream().distinct().collect(Collectors.toList());
    }

    private List<String> getSegmentAttributes(String projectKey, List<String> keys) {
        List<String> res = new ArrayList<>();
        if (CollectionUtils.isEmpty(keys)) return res;
        for (String key : keys) {
            Segment segment = segmentRepository.findByProjectKeyAndKey(projectKey, key).orElseThrow(() ->
                    new ResourceNotFoundException(ResourceType.SEGMENT, projectKey + "_" + key));
            List<SegmentRuleModel> segmentRules = JsonMapper.toListObject(segment.getRules(), SegmentRuleModel.class);
            if (CollectionUtils.isEmpty(segmentRules)) return res;
            for (SegmentRuleModel rule : segmentRules) {
                List<ConditionValue> conditions = rule.getConditions();
                if (CollectionUtils.isEmpty(conditions)) break;
                for (ConditionValue condition : conditions) {
                    res.add(condition.getSubject());
                }
            }
        }
        return res;
    }

    public List<PrerequisiteToggleResponse> preToggles(String projectKey, String environmentKey, String toggleKey,
                                                       PrerequisiteToggleRequest query) {
        List<Toggle> nonSelfToggles = getNonSelfToggles(projectKey, toggleKey, query);
        List<Targeting> nonSelfTargetingList = getNonSelfTargetingList(projectKey, environmentKey, toggleKey);
        Map<String, Targeting> targetingMap = nonSelfTargetingList.stream()
                .collect(Collectors.toMap(Targeting::getToggleKey, Function.identity()));
        return nonSelfToggles.stream().map(toggle -> buildPrerequisiteToggle(toggle, targetingMap))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Page<DependentToggleResponse> getDependentToggles(String projectKey, String environmentKey,
                                                             String toggleKey, DependentToggleRequest requestParam) {
        Page<Prerequisite> prerequisites = prerequisiteRepository
                .findAllByProjectKeyAndEnvironmentKeyAndParentToggleKey(projectKey, environmentKey, toggleKey,
                        PageRequestUtil.toPageable(requestParam, Sort.Direction.DESC, "createdTime"));
        if (prerequisites.isEmpty()) return Page.empty();
        Set<String> dependentToggleKeys = prerequisites.stream().map(Prerequisite::getToggleKey)
                .collect(Collectors.toSet());
        Map<String, Toggle> toggleMap = toggleRepository.findAllByProjectKeyAndKeyIn(projectKey, dependentToggleKeys)
                .stream().collect(Collectors.toMap(Toggle::getKey, Function.identity()));
        Map<String, Targeting> targetingMap = targetingRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(projectKey, environmentKey, dependentToggleKeys)
                .stream().collect(Collectors.toMap(Targeting::getToggleKey, Function.identity()));
        return  prerequisites.map(prerequisite -> buildDependentToggle(prerequisite, toggleMap, targetingMap));
    }

    private DependentToggleResponse buildDependentToggle(Prerequisite prerequisite, Map<String, Toggle> toggleMap,
                                                         Map<String, Targeting> targetingMap) {
        DependentToggleResponse dependentToggle = new DependentToggleResponse();
        dependentToggle.setDependentValue(prerequisite.getDependentValue());
        dependentToggle.setKey(prerequisite.getToggleKey());
        dependentToggle.setName(toggleMap.get(prerequisite.getToggleKey()).getName());
        dependentToggle.setDisabled(targetingMap.get(prerequisite.getToggleKey()).isDisabled());
        return dependentToggle;
    }

    private PrerequisiteToggleResponse buildPrerequisiteToggle(Toggle toggle, Map<String, Targeting> targetingMap) {
        PrerequisiteToggleResponse prerequisiteToggle = new PrerequisiteToggleResponse();
        Targeting targeting = targetingMap.get(toggle.getKey());
        if (Objects.isNull(targeting)) return null;
        prerequisiteToggle.setName(toggle.getName());
        prerequisiteToggle.setKey(toggle.getKey());
        prerequisiteToggle.setReturnType(toggle.getReturnType());
        prerequisiteToggle.setDisabled(targeting.isDisabled());
        List<Variation> variations = JsonMapper.toObject(targeting.getContent(),
                TargetingContent.class).getVariations();
        prerequisiteToggle.setVariations(variations);
        return prerequisiteToggle;
    }

    private List<Toggle> getNonSelfToggles(String projectKey, String toggleKey,
                                           PrerequisiteToggleRequest params) {
        Specification<Toggle> spec = (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("projectKey"), projectKey);
            Predicate p2 = root.get("key").in(toggleKey).not();
            if (StringUtils.isNotBlank(params.getKey())) {
                Predicate p3 = cb.equal(root.get("key"), params.getKey());
                return query.where(cb.and(p1, p2, p3)).getRestriction();
            } else if (StringUtils.isNotBlank(params.getLikeNameAndKey())) {
                Predicate p3 = cb.like(root.get("name"), "%" + params.getLikeNameAndKey() + "%");
                Predicate p4 = cb.like(root.get("key"), "%" + params.getLikeNameAndKey() + "%");
                return query.where(cb.and(p1, p2), cb.or(p3, p4)).getRestriction();
            }
            return query.where(cb.and(p1, p2)).getRestriction();
        };
        return toggleRepository.findAll(spec);
    }

    private List<Targeting> getNonSelfTargetingList(String projectKey, String environmentKey, String toggleKey) {
        Specification<Targeting> spec = (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("projectKey"), projectKey);
            Predicate p2 = cb.equal(root.get("environmentKey"), environmentKey);
            Predicate p3 = root.get("toggleKey").in(toggleKey).not();
            return query.where(cb.and(p1, p2, p3)).getRestriction();
        };
        return targetingRepository.findAll(spec);
    }

}
