package io.featureprobe.api.service;

import io.featureprobe.api.auth.TokenHelper;
import io.featureprobe.api.base.db.Archived;
import io.featureprobe.api.base.db.ExcludeTenant;
import io.featureprobe.api.base.model.TargetingContent;
import io.featureprobe.api.component.SpringBeanManager;
import io.featureprobe.api.dao.exception.ResourceConflictException;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.exception.ResourceOverflowException;
import io.featureprobe.api.dto.EnvironmentCreateRequest;
import io.featureprobe.api.dto.EnvironmentQueryRequest;
import io.featureprobe.api.dto.EnvironmentResponse;
import io.featureprobe.api.dto.EnvironmentUpdateRequest;
import io.featureprobe.api.dao.entity.Environment;
import io.featureprobe.api.dao.entity.Project;
import io.featureprobe.api.dao.entity.Targeting;
import io.featureprobe.api.dao.entity.Toggle;
import io.featureprobe.api.base.enums.ChangeLogType;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.mapper.EnvironmentMapper;
import io.featureprobe.api.dao.repository.EnvironmentRepository;
import io.featureprobe.api.dao.repository.ProjectRepository;
import io.featureprobe.api.dao.repository.TargetingRepository;
import io.featureprobe.api.base.util.KeyGenerateUtil;
import com.featureprobe.sdk.server.FPUser;
import com.featureprobe.sdk.server.FeatureProbe;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class EnvironmentService {

    private EnvironmentRepository environmentRepository;

    private ProjectRepository projectRepository;

    private TargetingRepository targetingRepository;

    private ChangeLogService changeLogService;

    private IncludeArchivedToggleService includeArchivedToggleService;

    private TargetingService targetingService;

    @PersistenceContext
    public EntityManager entityManager;

    private static final String LIMITER_TOGGLE_KEY = "FeatureProbe_env_limiter";

    @Transactional(rollbackFor = Exception.class)
    public EnvironmentResponse create(String projectKey, EnvironmentCreateRequest createRequest) {
        validateLimit(projectKey);
        Project project = projectRepository.findByKey(projectKey).get();
        Environment environment = EnvironmentMapper.INSTANCE.requestToEntity(createRequest);
        environment.setServerSdkKey(KeyGenerateUtil.getServerSdkKey());
        environment.setClientSdkKey(KeyGenerateUtil.getClientSdkKey());
        environment.setProject(project);
        createEnvironmentTargetingList(projectKey, createRequest.getKey(), createRequest.getCopyFrom());
        changeLogService.create(environment, ChangeLogType.ADD);

        return EnvironmentMapper.INSTANCE.entityToResponse(environmentRepository.save(environment));
    }

    @Transactional(rollbackFor = Exception.class)
    public EnvironmentResponse update(String projectKey, String environmentKey,
                                      EnvironmentUpdateRequest updateRequest) {
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT, environmentKey));
        if (!StringUtils.equals(environment.getName(), updateRequest.getName())) {
            validateEnvironmentByName(projectKey, updateRequest.getName());
        }
        EnvironmentMapper.INSTANCE.mapEntity(updateRequest, environment);
        if (updateRequest.isResetServerSdk()) {
            environment.setServerSdkKey(KeyGenerateUtil.getServerSdkKey());
        }
        if (updateRequest.isResetClientSdk()) {
            environment.setClientSdkKey(KeyGenerateUtil.getClientSdkKey());
        }
        return EnvironmentMapper.INSTANCE.entityToResponse(environmentRepository.save(environment));
    }


    @Transactional(rollbackFor = Exception.class)
    @Archived
    public EnvironmentResponse offline(String projectKey, String environmentKey) {
        Environment environment = environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey,
                environmentKey, false).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.ENVIRONMENT, environmentKey));
        changeLogService.create(environment, ChangeLogType.DELETE);
        environment.setArchived(true);
        return EnvironmentMapper.INSTANCE.entityToResponse(environmentRepository.save(environment));
    }

    @Transactional(rollbackFor = Exception.class)
    @Archived
    public EnvironmentResponse restore(String projectKey, String environmentKey) {
        Environment environment = environmentRepository.findByProjectKeyAndKeyAndArchived(projectKey,
                environmentKey, true).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.ENVIRONMENT, environmentKey));
        changeLogService.create(environment, ChangeLogType.ADD);
        environment.setArchived(false);
        return EnvironmentMapper.INSTANCE.entityToResponse(environmentRepository.save(environment));
    }

    public EnvironmentResponse query(String projectKey, String environmentKey) {
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT, environmentKey));
        return EnvironmentMapper.INSTANCE.entityToResponse(environment);
    }

    @Archived
    public List<EnvironmentResponse> list(String projectKey, EnvironmentQueryRequest queryRequest) {
        List<Environment> environments = environmentRepository
                .findAllByProjectKeyAndArchivedOrderByCreatedTimeAsc(projectKey, queryRequest.isArchived());
        return environments.stream().map(environment -> EnvironmentMapper.INSTANCE.entityToResponse(environment))
                .collect(Collectors.toList());
    }

    private void validateLimit(String projectKey) {
        long total = environmentRepository.countByProjectKey(projectKey);
        FPUser user = new FPUser(String.valueOf(TokenHelper.getUserId()));
        user.with("account", TokenHelper.getAccount());
        double limitNum = SpringBeanManager.getBeanByType(FeatureProbe.class)
                .numberValue(LIMITER_TOGGLE_KEY, user, -1);
        if (limitNum > 0 && total >= limitNum) {
            throw new ResourceOverflowException(ResourceType.ENVIRONMENT);
        }
    }

    private List<Targeting> createEnvironmentTargetingList(String projectKey, String environmentKey,
                                                           String copyFromEnvKey) {
        List<Targeting> targetingList;
        if (StringUtils.isBlank(copyFromEnvKey)) {
            targetingList = includeArchivedToggleService.findAllByProjectKey(projectKey).stream()
                    .map(toggle -> createTargetingByToggle(toggle, environmentKey))
                    .collect(Collectors.toList());
        } else {
            targetingList = targetingRepository.findAllByProjectKeyAndEnvironmentKey(projectKey, copyFromEnvKey)
                    .stream()
                    .map(targeting -> copyTargeting(environmentKey, targeting)).collect(Collectors.toList());
        }
        if (targetingList.isEmpty()) {
            return Collections.emptyList();
        }
        targetingService.createTargetingEntities(targetingList);
        return targetingList;
    }

    private Targeting copyTargeting(String newEnvironmentKey, Targeting sourceTargeting) {
        Targeting newTargeting = this.createTargeting(sourceTargeting.getProjectKey(), newEnvironmentKey,
                sourceTargeting.getToggleKey(), sourceTargeting.getContent());
        newTargeting.setDeleted(sourceTargeting.isDeleted());
        newTargeting.setDisabled(sourceTargeting.isDisabled());
        newTargeting.setStatus(sourceTargeting.getStatus());
        return newTargeting;
    }

    private Targeting createTargetingByToggle(Toggle toggle, String environmentKey) {
        String defaultContent = TargetingContent.newDefault(toggle.getVariations(),
                toggle.getDisabledServe()).toJson();
        return this.createTargeting(toggle.getProjectKey(), environmentKey, toggle.getKey(), defaultContent);
    }

    private Targeting createTargeting(String projectKey, String environmentKey, String toggleKey,
                                      String content) {
        Targeting targeting = new Targeting();
        targeting.setDisabled(true);
        targeting.setDeleted(false);
        targeting.setContent(content);
        targeting.setVersion(1L);
        targeting.setProjectKey(projectKey);
        targeting.setToggleKey(toggleKey);
        targeting.setEnvironmentKey(environmentKey);
        targeting.setPublishTime(new Date());
        return targeting;
    }


    private void validateEnvironmentByName(String projectKey, String name) {
        if (environmentRepository.existsByProjectKeyAndName(projectKey, name)) {
            throw new ResourceConflictException(ResourceType.ENVIRONMENT);
        }
    }

    @ExcludeTenant
    public String getSdkServerKey(String serverKeyOrClientKey) {
        return environmentRepository.findByServerSdkKeyOrClientSdkKey(serverKeyOrClientKey, serverKeyOrClientKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.ENVIRONMENT, serverKeyOrClientKey))
                .getServerSdkKey();
    }
}
