package io.featureprobe.api.service;

import io.featureprobe.api.base.constants.MessageKey;
import io.featureprobe.api.base.db.Archived;
import io.featureprobe.api.base.util.JsonMapper;
import io.featureprobe.api.base.util.ToggleContentLimitChecker;
import io.featureprobe.api.dao.entity.SegmentVersion;
import io.featureprobe.api.dao.entity.ToggleControlConf;
import io.featureprobe.api.dao.exception.ResourceConflictException;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.SegmentVersionRepository;
import io.featureprobe.api.dao.repository.ToggleControlConfRepository;
import io.featureprobe.api.dao.utils.PageRequestUtil;
import io.featureprobe.api.dto.SegmentCreateRequest;
import io.featureprobe.api.dto.SegmentPublishRequest;
import io.featureprobe.api.dto.SegmentResponse;
import io.featureprobe.api.dto.SegmentSearchRequest;
import io.featureprobe.api.dto.SegmentUpdateRequest;
import io.featureprobe.api.dto.SegmentVersionRequest;
import io.featureprobe.api.dto.SegmentVersionResponse;
import io.featureprobe.api.dto.ToggleSegmentResponse;
import io.featureprobe.api.dao.entity.Environment;
import io.featureprobe.api.dao.entity.Project;
import io.featureprobe.api.dao.entity.Segment;
import io.featureprobe.api.dao.entity.Targeting;
import io.featureprobe.api.dao.entity.TargetingSegment;
import io.featureprobe.api.dao.entity.Toggle;
import io.featureprobe.api.base.enums.ChangeLogType;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.enums.ValidateTypeEnum;
import io.featureprobe.api.mapper.SegmentMapper;
import io.featureprobe.api.dao.repository.EnvironmentRepository;
import io.featureprobe.api.dao.repository.ProjectRepository;
import io.featureprobe.api.dao.repository.SegmentRepository;
import io.featureprobe.api.dao.repository.TargetingRepository;
import io.featureprobe.api.dao.repository.TargetingSegmentRepository;
import io.featureprobe.api.dao.repository.ToggleRepository;
import io.featureprobe.api.base.model.PaginationRequest;
import io.featureprobe.api.mapper.SegmentVersionMapper;
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
import javax.persistence.OptimisticLockException;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class SegmentService {

    private SegmentRepository segmentRepository;

    private TargetingSegmentRepository targetingSegmentRepository;

    private TargetingRepository targetingRepository;

    private ToggleRepository toggleRepository;

    private EnvironmentRepository environmentRepository;

    private ProjectRepository projectRepository;

    private SegmentVersionRepository segmentVersionRepository;

    private ToggleControlConfRepository toggleControlConfRepository;
    private ChangeLogService changeLogService;

    @PersistenceContext
    public EntityManager entityManager;

    public Page<SegmentResponse> list(String projectKey, SegmentSearchRequest searchRequest) {
        Specification<Segment> spec = buildQuerySpec(projectKey, searchRequest.getKeyword());
        return findPagingBySpec(spec, PageRequestUtil.toCreatedTimeDescSortPageable(searchRequest));
    }

    public SegmentResponse create(String projectKey, SegmentCreateRequest createRequest) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        validateKey(projectKey, createRequest.getKey());
        validateName(projectKey, createRequest.getName());
        Segment segment = SegmentMapper.INSTANCE.requestToEntity(createRequest);
        segment.setProjectKey(projectKey);
        segment.setUniqueKey(StringUtils.join(projectKey, "$", createRequest.getKey()));
        segment.setRules(JsonMapper.toJSONString(Collections.emptyList()));
        segment.setVersion(1L);
        saveSegmentChangeLog(project);
        Segment savedSegment = segmentRepository.save(segment);
        saveSegmentVersion(buildSegmentVersion(savedSegment, null, null));
        return SegmentMapper.INSTANCE.entityToResponse(savedSegment);
    }

    @Transactional(rollbackFor = Exception.class)
    public SegmentResponse update(String projectKey, String segmentKey, SegmentUpdateRequest updateRequest) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        Segment segment = segmentRepository.findByProjectKeyAndKey(projectKey, segmentKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.SEGMENT, projectKey + "_" + segmentKey));
        if (!StringUtils.equals(segment.getName(), updateRequest.getName())) {
            validateName(projectKey, updateRequest.getName());
        }
        SegmentMapper.INSTANCE.mapEntity(updateRequest, segment);
        saveSegmentChangeLog(project);
        return SegmentMapper.INSTANCE.entityToResponse(segmentRepository.save(segment));
    }

    @Transactional(rollbackFor = Exception.class)
    public SegmentResponse publish(String projectKey, String segmentKey, SegmentPublishRequest publishRequest) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        Segment segment = segmentRepository.findByProjectKeyAndKey(projectKey, segmentKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.SEGMENT, projectKey + "_" + segmentKey));

        this.validatePublishConflicts(segment, publishRequest.getBaseVersion());
        SegmentMapper.INSTANCE.mapEntity(publishRequest, segment);
        Long oldVersion = ObjectUtils.isNotEmpty(publishRequest.getBaseVersion())
                ? publishRequest.getBaseVersion() : segment.getVersion();

        ToggleContentLimitChecker.validateSize(segment.getRules());

        Segment updatedSegment = segmentRepository.saveAndFlush(segment);
        if (updatedSegment.getVersion() > oldVersion) {
            saveSegmentVersion(buildSegmentVersion(updatedSegment, publishRequest.getComment(), null));
        }
        saveSegmentChangeLog(project);
        return SegmentMapper.INSTANCE.entityToResponse(updatedSegment);
    }

    protected void validatePublishConflicts(Segment segment, Long baseVersion){
        if (baseVersion != null) {
            if (segment.getVersion() != null && !segment.getVersion().equals(baseVersion)) {
                throw new OptimisticLockException("publish conflict");
            }
        }
    }

    private void saveSegmentChangeLog(Project project) {
        if (CollectionUtils.isNotEmpty(project.getEnvironments())) {
            for (Environment environment : project.getEnvironments()) {
                changeLogService.create(environment, ChangeLogType.CHANGE);
            }
        }
    }

    public Page<SegmentVersionResponse> versions(String projectKey, String segmentKey,
                                                 SegmentVersionRequest versionRequest) {
        Specification<SegmentVersion> spec = buildVersionsQuerySpec(projectKey, segmentKey);
        Page<SegmentVersion> versions = segmentVersionRepository.findAll(spec,
                PageRequestUtil.toPageable(versionRequest, Sort.Direction.DESC, "version"));
        return versions.map(version -> SegmentVersionMapper.INSTANCE.entityToResponse(version));
    }

    public SegmentResponse delete(String projectKey, String segmentKey) {
        Project project = projectRepository.findByKey(projectKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        if (targetingSegmentRepository.countByProjectKeyAndSegmentKey(projectKey, segmentKey) > 0) {
            throw new IllegalArgumentException(MessageKey.USING);
        }
        Segment segment = segmentRepository.findByProjectKeyAndKey(projectKey, segmentKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.SEGMENT, projectKey + "_" + segmentKey));
        segment.setDeleted(true);
        if (CollectionUtils.isNotEmpty(project.getEnvironments())) {
            for (Environment environment : project.getEnvironments()) {
                changeLogService.create(environment, ChangeLogType.CHANGE);
            }
        }
        return SegmentMapper.INSTANCE.entityToResponse(segmentRepository.save(segment));
    }

    @Archived
    public Page<ToggleSegmentResponse> usingToggles(String projectKey, String segmentKey,
                                                    PaginationRequest paginationRequest) {
        List<TargetingSegment> targetingSegments = targetingSegmentRepository
                .findByProjectKeyAndSegmentKey(projectKey, segmentKey);
        List<Targeting> targetingList = targetingRepository.findAllById(
                targetingSegments.stream().map(TargetingSegment::getTargetingId).collect(Collectors.toList()));
        List<Toggle> toggles = toggleRepository.findAllByProjectKeyAndKeyIn(projectKey,
                targetingList.stream().map(Targeting::getToggleKey).collect(Collectors.toList()));
        Map<String, Toggle> toggleMap = toggles.stream()
                .collect(Collectors.toMap(Toggle::getKey, Function.identity()));
        Map<Long, String> targetingIdToToggleKey = targetingList.stream().
                collect(Collectors.toMap(Targeting::getId, Targeting::getToggleKey));
        List<Long> targetingIds = targetingSegments.stream().filter(targetingSegment ->
            toggleMap.get(targetingIdToToggleKey.get(targetingSegment.getTargetingId())) != null)
                .map(TargetingSegment::getTargetingId).collect(Collectors.toList());
        Pageable pageable = PageRequest.of(paginationRequest.getPageIndex(), paginationRequest.getPageSize(),
                Sort.Direction.DESC, "createdTime");
        Specification<Targeting> spec = (root, query, cb) -> {
            Predicate p0 = root.get("id").in(targetingIds);
            query.where(cb.and(p0));
            return query.getRestriction();
        };
        Page<Targeting> targetingPage = targetingRepository.findAll(spec, pageable);
        Page<ToggleSegmentResponse> res = targetingPage.map(targeting -> {
            Toggle toggle = toggleMap.get(targeting.getToggleKey());
            ToggleSegmentResponse toggleSegmentResponse = SegmentMapper.INSTANCE
                    .toggleToToggleSegment(toggle);
            toggleSegmentResponse.setDisabled(targeting.isDisabled());
            Optional<Environment> environment = environmentRepository
                    .findByProjectKeyAndKey(projectKey, targeting.getEnvironmentKey());
            Optional<ToggleControlConf> toggleControlConfOptional = toggleControlConfRepository
                    .findByProjectKeyAndEnvironmentKeyAndToggleKey(targeting.getProjectKey(),
                            targeting.getEnvironmentKey(), targeting.getToggleKey());
            toggleSegmentResponse.setAnalyzing(
                    toggleControlConfOptional.isPresent() && toggleControlConfOptional.get().isTrackAccessEvents());
            toggleSegmentResponse.setEnvironmentName(environment.get().getName());
            toggleSegmentResponse.setEnvironmentKey(environment.get().getKey());
            return toggleSegmentResponse;
        });
        return res;
    }

    public SegmentResponse queryByKey(String projectKey, String segmentKey) {
        Segment segment = segmentRepository.findByProjectKeyAndKey(projectKey, segmentKey).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.SEGMENT, projectKey + "_" + segmentKey));
        return SegmentMapper.INSTANCE.entityToResponse(segment);
    }

    private SegmentVersion buildSegmentVersion(Segment segment, String comment, Long approvalId) {
        SegmentVersion segmentVersion = new SegmentVersion();
        segmentVersion.setVersion(segment.getVersion());
        segmentVersion.setKey(segment.getKey());
        segmentVersion.setRules(segment.getRules());
        segmentVersion.setComment(comment);
        segmentVersion.setApprovalId(approvalId);
        segmentVersion.setProjectKey(segment.getProjectKey());
        return segmentVersion;
    }

    private void saveSegmentVersion(SegmentVersion segmentVersion) {
        segmentVersionRepository.save(segmentVersion);
    }

    private Specification<Segment> buildQuerySpec(String projectKey, String keyword) {
        return (root, query, cb) -> {
            Predicate p3 = cb.equal(root.get("projectKey"), projectKey);
            if (StringUtils.isNotBlank(keyword)) {
                Predicate p0 = cb.like(root.get("name"), "%" + keyword + "%");
                Predicate p1 = cb.like(root.get("key"), "%" + keyword + "%");
                Predicate p2 = cb.like(root.get("description"), "%" + keyword + "%");
                query.where(cb.or(p0, p1, p2), cb.and(p3));
            } else {
                query.where(p3);
            }
            return query.getRestriction();
        };
    }

    private Page<SegmentResponse> findPagingBySpec(Specification<Segment> spec, Pageable pageable) {
        Page<Segment> segments = segmentRepository.findAll(spec, pageable);
        return segments.map(segment -> SegmentMapper.INSTANCE.entityToResponse(segment));
    }


    private Specification<SegmentVersion> buildVersionsQuerySpec(String projectKey, String key) {
        return (root, query, cb) -> {
            Predicate p1 = cb.equal(root.get("projectKey"), projectKey);
            Predicate p2 = cb.equal(root.get("key"), key);
            return query.where(cb.and(p1, p2)).getRestriction();
        };
    }

    public void validateExists(String projectKey, ValidateTypeEnum type, String value) {
        switch (type) {
            case KEY:
                validateKey(projectKey, value);
                break;
            case NAME:
                validateName(projectKey, value);
                break;
            default:
                break;
        }
    }

    public void validateKey(String projectKey, String key) {
        if (segmentRepository.existsByProjectKeyAndKey(projectKey, key)) {
            throw new ResourceConflictException(ResourceType.SEGMENT);
        }
    }

    public void validateName(String projectKey, String name) {
        if (segmentRepository.existsByProjectKeyAndName(projectKey, name)) {
            throw new ResourceConflictException(ResourceType.SEGMENT);
        }
    }

}
