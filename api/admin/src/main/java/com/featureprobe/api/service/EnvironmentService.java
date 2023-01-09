package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.db.Archived;
import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.model.TargetingContent;
import com.featureprobe.api.component.SpringBeanManager;
import com.featureprobe.api.dao.exception.ResourceConflictException;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.exception.ResourceOverflowException;
import com.featureprobe.api.dto.EnvironmentCreateRequest;
import com.featureprobe.api.dto.EnvironmentQueryRequest;
import com.featureprobe.api.dto.EnvironmentResponse;
import com.featureprobe.api.dto.EnvironmentUpdateRequest;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Project;
import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.dao.entity.Toggle;
import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.mapper.EnvironmentMapper;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.ProjectRepository;
import com.featureprobe.api.dao.repository.TargetingRepository;
import com.featureprobe.api.dao.repository.ToggleRepository;
import com.featureprobe.api.base.util.KeyGenerateUtil;
import com.featureprobe.sdk.server.FPUser;
import com.featureprobe.sdk.server.FeatureProbe;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class EnvironmentService {

    private EnvironmentRepository environmentRepository;

    private ProjectRepository projectRepository;

    private ToggleRepository toggleRepository;

    private TargetingRepository targetingRepository;

    private ChangeLogService changeLogService;

    private IncludeArchivedToggleService includeArchivedToggleService;

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
        initEnvironmentTargeting(projectKey, createRequest.getKey());
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
                .findAllByProjectKeyAndArchived(projectKey, queryRequest.isArchived());
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

    private void initEnvironmentTargeting(String projectKey, String environmentKey) {
        List<Toggle> toggles = includeArchivedToggleService.findAllByProjectKey(projectKey);
        List<Targeting> targetingList = toggles.stream().map(toggle -> createDefaultTargeting(toggle, environmentKey))
                .collect(Collectors.toList());
        targetingRepository.saveAll(targetingList);
    }

    private Targeting createDefaultTargeting(Toggle toggle, String environmentKey) {
        Targeting targeting = new Targeting();
        targeting.setDeleted(false);
        targeting.setVersion(1L);
        targeting.setProjectKey(toggle.getProjectKey());
        targeting.setDisabled(true);
        targeting.setContent(TargetingContent.newDefault(toggle.getVariations(),
                toggle.getDisabledServe()).toJson());
        targeting.setToggleKey(toggle.getKey());
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
