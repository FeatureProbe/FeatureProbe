package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.db.Archived;
import com.featureprobe.api.dao.utils.PageRequestUtil;
import com.featureprobe.api.dto.ApprovalRecordQueryRequest;
import com.featureprobe.api.dto.ApprovalRecordResponse;
import com.featureprobe.api.dao.entity.ApprovalRecord;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Project;
import com.featureprobe.api.dao.entity.TargetingSketch;
import com.featureprobe.api.dao.entity.Toggle;
import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import com.featureprobe.api.base.enums.ApprovalTypeEnum;
import com.featureprobe.api.base.enums.SketchStatusEnum;
import com.featureprobe.api.mapper.ApprovalRecordMapper;
import com.featureprobe.api.dao.repository.ApprovalRecordRepository;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.ProjectRepository;
import com.featureprobe.api.dao.repository.TargetingSketchRepository;
import com.featureprobe.api.dao.repository.ToggleRepository;
import com.featureprobe.api.base.util.JsonMapper;
import lombok.AllArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class ApprovalRecordService {

    private ProjectRepository projectRepository;
    private EnvironmentRepository environmentRepository;
    private ToggleRepository toggleRepository;
    private ApprovalRecordRepository approvalRecordRepository;
    private TargetingSketchRepository targetingSketchRepository;

    @PersistenceContext
    public EntityManager entityManager;

    @Archived
    public Page<ApprovalRecordResponse> list(ApprovalRecordQueryRequest queryRequest) {
        Specification<ApprovalRecord> spec = buildListSpec(queryRequest);
        Pageable pageable = PageRequestUtil.toCreatedTimeDescSortPageable(queryRequest);
        Page<ApprovalRecord> approvalRecords = approvalRecordRepository.findAll(spec, pageable);
        Set<Long> approvalIds = approvalRecords.getContent().stream().map(ApprovalRecord::getId)
                .collect(Collectors.toSet());
        Map<Long, TargetingSketch> targetingSketchMap = queryTargetingSketchMap(approvalIds);
        Map<String, Project> projectMap = queryProjectMap(approvalRecords.getContent().stream()
                .map(ApprovalRecord::getProjectKey).collect(Collectors.toSet()));
        Map<String, Environment> environmentMap = queryEnvironmentMap(approvalRecords.getContent().stream()
                .map(ApprovalRecord::getEnvironmentKey).collect(Collectors.toSet()));
        Map<String, Toggle> toggleMap = queryToggleMap(approvalRecords.getContent().stream()
                .map(ApprovalRecord::getToggleKey).collect(Collectors.toSet()));
        Page<ApprovalRecordResponse> res = approvalRecords.map(approvalRecord ->
                translateResponse(approvalRecord, targetingSketchMap, projectMap, environmentMap, toggleMap));
        List<ApprovalRecordResponse> sortedRes = res.getContent().stream()
                .sorted(Comparator.comparing(ApprovalRecordResponse::isLocked).reversed()).collect(Collectors.toList());
        return new PageImpl<>(sortedRes, pageable, res.getTotalElements());
    }

    public long total(ApprovalStatusEnum status) {
        return approvalRecordRepository.countByStatusAndReviewersIsContaining(status,
                "\"" + TokenHelper.getAccount() + "\"");
    }

    private Specification<ApprovalRecord> buildListSpec(ApprovalRecordQueryRequest queryRequest) {
        return (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("submitBy"), TokenHelper.getAccount());
            Predicate p2 = cb.like(root.get("reviewers"), "%\"" + TokenHelper.getAccount() + "\"%");
            Predicate statusPredicate;
            if (queryRequest.getType() == ApprovalTypeEnum.APPLY) {
                if (CollectionUtils.isNotEmpty(queryRequest.getStatus())) {
                    Predicate p3 = root.get("status").in(queryRequest.getStatus());
                    statusPredicate = cb.and(p1, p3);
                } else {
                    statusPredicate = cb.and(p1);
                }
            } else {
                if (CollectionUtils.isNotEmpty(queryRequest.getStatus())) {
                    Predicate p3 = root.get("status").in(queryRequest.getStatus());
                    statusPredicate = cb.and(p2, p3);
                } else {
                    statusPredicate = cb.and(p2);
                }
            }
            if (StringUtils.isNotBlank(queryRequest.getKeyword())) {
                List<Toggle> toggles = toggleRepository.findByNameLike(queryRequest.getKeyword());
                Set<String> toggleKeys = toggles.stream().map(Toggle::getKey).collect(Collectors.toSet());
                Predicate p4 = root.get("toggleKey").in(toggleKeys);
                Predicate p5 = cb.like(root.get("title"), "%" + queryRequest.getKeyword() + "%");
                query.where(statusPredicate, cb.or(p4, p5));
            } else {
                query.where(statusPredicate);
            }
            return query.getRestriction();
        };
    }

    private Map<Long, TargetingSketch> queryTargetingSketchMap(Set<Long> approvalIds) {
        List<TargetingSketch> targetingSketches = targetingSketchRepository.findByApprovalIdIn(approvalIds);
        return targetingSketches.stream()
                .collect(Collectors.toMap(TargetingSketch::getApprovalId, Function.identity()));
    }

    private Map<String, Project> queryProjectMap(Set<String> projectKeys) {
        List<Project> projects = projectRepository.findByKeyIn(projectKeys);
        return projects.stream().collect(Collectors.toMap(Project::getKey, Function.identity()));
    }

    private Map<String, Environment> queryEnvironmentMap(Set<String> environmentKeys) {
        List<Environment> environments = environmentRepository.findByKeyIn(environmentKeys);
        return environments.stream().collect(Collectors.toMap(Environment::uniqueKey, Function.identity()));
    }

    private Map<String, Toggle> queryToggleMap(Set<String> toggleKeys) {
        List<Toggle> toggles = toggleRepository.findByKeyIn(toggleKeys);
        return toggles.stream().collect(Collectors.toMap(Toggle::uniqueKey, Function.identity()));
    }

    private ApprovalRecordResponse translateResponse(ApprovalRecord approvalRecord,
                                                     Map<Long, TargetingSketch> targetingSketchMap,
                                                     Map<String, Project> projectMap,
                                                     Map<String, Environment> environmentMap,
                                                     Map<String, Toggle> toggleMap) {
        ApprovalRecordResponse approvalRecordResponse = ApprovalRecordMapper.INSTANCE.entityToResponse(approvalRecord);
        approvalRecordResponse.setProjectName(projectMap.get(approvalRecord.getProjectKey()).getName());
        approvalRecordResponse.setEnvironmentName(environmentMap.get(approvalRecord.environmentUniqueKey()).getName());
        approvalRecordResponse.setToggleName(toggleMap.get(approvalRecord.toggleUniqueKey()).getName());
        approvalRecordResponse.setReviewers(JsonMapper.toListObject(approvalRecord.getReviewers(), String.class));
        approvalRecordResponse.setComment(approvalRecord.getComment());
        TargetingSketch sketch = targetingSketchMap.get(approvalRecord.getId());
        if (locked(sketch)) {
            approvalRecordResponse.setLocked(true);
            approvalRecordResponse.setLockedTime(sketch.getCreatedTime());
        }
        if (SketchStatusEnum.CANCEL == sketch.getStatus()) {
            approvalRecordResponse.setCanceled(true);
            approvalRecordResponse.setCancelReason(sketch.getComment());
        }
        return approvalRecordResponse;
    }


    private boolean locked(TargetingSketch targetingSketch) {
        return targetingSketch.getStatus() == SketchStatusEnum.PENDING;
    }

}
