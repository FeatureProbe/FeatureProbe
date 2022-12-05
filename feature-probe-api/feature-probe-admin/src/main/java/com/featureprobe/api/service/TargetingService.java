package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import com.featureprobe.api.base.model.BaseRule;
import com.featureprobe.api.base.model.TargetingContent;
import com.featureprobe.api.base.model.ToggleRule;
import com.featureprobe.api.base.model.Variation;
import com.featureprobe.api.base.tenant.TenantContext;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.utils.PageRequestUtil;
import com.featureprobe.api.dto.AfterTargetingVersionResponse;
import com.featureprobe.api.dto.ApprovalResponse;
import com.featureprobe.api.dto.CancelSketchRequest;
import com.featureprobe.api.dto.TargetingApprovalRequest;
import com.featureprobe.api.dto.TargetingDiffResponse;
import com.featureprobe.api.dto.TargetingPublishRequest;
import com.featureprobe.api.dto.TargetingResponse;
import com.featureprobe.api.dto.TargetingVersionRequest;
import com.featureprobe.api.dto.TargetingVersionResponse;
import com.featureprobe.api.dto.UpdateApprovalStatusRequest;
import com.featureprobe.api.dao.entity.ApprovalRecord;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.dao.entity.TargetingSegment;
import com.featureprobe.api.dao.entity.TargetingSketch;
import com.featureprobe.api.dao.entity.TargetingVersion;
import com.featureprobe.api.dao.entity.VariationHistory;
import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.enums.SketchStatusEnum;
import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import com.featureprobe.api.mapper.ApprovalRecordMapper;
import com.featureprobe.api.mapper.TargetingMapper;
import com.featureprobe.api.mapper.TargetingVersionMapper;
import com.featureprobe.api.base.model.ConditionValue;
import com.featureprobe.api.base.model.PaginationRequest;
import com.featureprobe.api.dao.repository.ApprovalRecordRepository;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.SegmentRepository;
import com.featureprobe.api.dao.repository.TargetingRepository;
import com.featureprobe.api.dao.repository.TargetingSegmentRepository;
import com.featureprobe.api.dao.repository.TargetingSketchRepository;
import com.featureprobe.api.dao.repository.TargetingVersionRepository;
import com.featureprobe.api.dao.repository.VariationHistoryRepository;
import com.featureprobe.api.base.util.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeSet;
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

    private ChangeLogService changeLogService;

    @PersistenceContext
    public EntityManager entityManager;

    @Transactional(rollbackFor = Exception.class)
    public TargetingResponse publish(String projectKey, String environmentKey, String toggleKey,
                                    TargetingPublishRequest targetingPublishRequest) {
        validateTargetingContent(projectKey, targetingPublishRequest.getContent());
        Environment environment = selectEnvironment(projectKey, environmentKey);
        changeLogService.create(environment, ChangeLogType.CHANGE);
        return publishTargeting(projectKey, environmentKey, toggleKey, targetingPublishRequest, null);
    }

    @Transactional(rollbackFor = Exception.class)
    public ApprovalResponse approval(String projectKey, String environmentKey, String toggleKey,
                                      TargetingApprovalRequest approvalRequest) {
        validateTargetingContent(projectKey, approvalRequest.getContent());
        Environment environment = selectEnvironment(projectKey, environmentKey);
        if (environment.isEnableApproval()) {
            List<String> reviews = JsonMapper.toListObject(environment.getReviewers(), String.class);
            approvalRequest.setReviewers(reviews);
            Targeting targeting = selectTargeting(projectKey, environmentKey, toggleKey);
            targeting.setStatus(ToggleReleaseStatusEnum.PENDING_APPROVAL);
            targetingRepository.save(targeting);
            ApprovalRecord approvalRecord = submitApproval(projectKey, environmentKey,
                    toggleKey, approvalRequest);
            Targeting approval = new Targeting();
            approval.setDisabled(approvalRequest.getDisabled());
            approval.setContent(JsonMapper.toJSONString(approvalRequest.getContent()));
            return buildApprovalResponse(approvalRecord, targeting, approval);
        }
        throw new IllegalArgumentException("approval is disable");
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

    @Transactional(rollbackFor = Exception.class)
    public TargetingResponse publishSketch(String projectKey, String environmentKey, String toggleKey) {
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
                    sketch.getComment(), sketch.getDisabled());
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
                publishSketch(projectKey, environmentKey, toggleKey);
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
        Targeting existedTargeting = selectTargeting(projectKey, environmentKey, toggleKey);
        long oldVersion = existedTargeting.getVersion();
        Targeting updatedTargeting = updateTargeting(existedTargeting, targetingPublishRequest);
        if (updatedTargeting.getVersion() > oldVersion) {
            saveTargetingSegmentRefs(projectKey, updatedTargeting, targetingPublishRequest.getContent());
            saveTargetingVersion(buildTargetingVersion(updatedTargeting,
                    targetingPublishRequest.getComment(), approvalId));
            saveVariationHistory(updatedTargeting, targetingPublishRequest.getContent());
        }
        updatedTargeting.setStatus(ToggleReleaseStatusEnum.RELEASE);
        return TargetingMapper.INSTANCE.entityToResponse(updatedTargeting);
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

    private Targeting updateTargeting(Targeting currentTargeting,
                                      TargetingPublishRequest updateTargetingPublishRequest) {
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

    private void saveTargetingVersion(TargetingVersion targetingVersion) {
        targetingVersionRepository.save(targetingVersion);
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

    private void validateTargetingContent(String projectKey, TargetingContent content) {
        if (CollectionUtils.isEmpty(content.getRules())) {
            return;
        }
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

}
