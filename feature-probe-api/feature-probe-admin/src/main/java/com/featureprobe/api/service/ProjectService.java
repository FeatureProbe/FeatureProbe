package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.component.SpringBeanManager;
import com.featureprobe.api.dao.exception.ResourceConflictException;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.exception.ResourceOverflowException;
import com.featureprobe.api.dto.ApprovalSettings;
import com.featureprobe.api.dto.PreferenceCreateRequest;
import com.featureprobe.api.dto.ProjectCreateRequest;
import com.featureprobe.api.dto.ProjectQueryRequest;
import com.featureprobe.api.dto.ProjectResponse;
import com.featureprobe.api.dto.ProjectUpdateRequest;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Project;
import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.enums.SketchStatusEnum;
import com.featureprobe.api.base.enums.ValidateTypeEnum;
import com.featureprobe.api.mapper.EnvironmentMapper;
import com.featureprobe.api.mapper.ProjectMapper;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.ProjectRepository;
import com.featureprobe.api.dao.repository.TargetingSketchRepository;
import com.featureprobe.api.base.util.KeyGenerateUtil;
import com.featureprobe.sdk.server.FPUser;
import com.featureprobe.sdk.server.FeatureProbe;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class ProjectService {

    private ProjectRepository projectRepository;

    private EnvironmentRepository environmentRepository;

    private TargetingSketchRepository targetingSketchRepository;

    private ChangeLogService changeLogService;

    @PersistenceContext
    public EntityManager entityManager;

    private static final String LIMITER_TOGGLE_KEY = "FeatureProbe_project_limiter";

    @Transactional(rollbackFor = Exception.class)
    public ProjectResponse create(ProjectCreateRequest createRequest) {
        validateLimit();
        return ProjectMapper.INSTANCE.entityToResponse(createProject(createRequest));
    }

    @Transactional(rollbackFor = Exception.class)
    public ProjectResponse update(String projectKey, ProjectUpdateRequest updateRequest) {
        Project project = projectRepository.findByKey(projectKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        if (!StringUtils.equals(project.getName(), updateRequest.getName())) {
            validateName(updateRequest.getName());
        }
        ProjectMapper.INSTANCE.mapEntity(updateRequest, project);
        return ProjectMapper.INSTANCE.entityToResponse(projectRepository.save(project));
    }

    @Transactional(rollbackFor = Exception.class)
    public ProjectResponse delete(String projectKey) {
        Project project = projectRepository.findByKey(projectKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.PROJECT, projectKey));
        project.setArchived(true);
        archiveAllEnvironments(project.getEnvironments());
        return ProjectMapper.INSTANCE.entityToResponse(projectRepository.save(project));
    }


    @Transactional(rollbackFor = Exception.class)
    public List<ApprovalSettings> updateApprovalSettings(String projectKey, PreferenceCreateRequest createRequest) {
        Map<String, ApprovalSettings> approvalSettingsMap = createRequest.getApprovalSettings().stream()
                .collect(Collectors.toMap(ApprovalSettings::getEnvironmentKey, Function.identity()));
        if (CollectionUtils.isNotEmpty(createRequest.getApprovalSettings())) {
            List<Environment> environments = environmentRepository.findAllByProjectKey(projectKey);
            environments.stream().forEach(environment -> EnvironmentMapper.INSTANCE
                    .mapEntity(approvalSettingsMap.get(environment.getKey()), environment));
            environmentRepository.saveAll(environments);
        }
        return approvalSettingsList(projectKey);
    }

    public List<ApprovalSettings> approvalSettingsList(String projectKey) {
        List<Environment> environments = environmentRepository.findAllByProjectKey(projectKey);
        List<ApprovalSettings> approvalSettingsList = environments.stream().map(environment ->
                EnvironmentMapper.INSTANCE.entityToApprovalSettings(environment)).collect(Collectors.toList());
        for (ApprovalSettings approvalSettings : approvalSettingsList) {
            boolean locked = targetingSketchRepository.existsByProjectKeyAndEnvironmentKeyAndStatus(projectKey,
                    approvalSettings.getEnvironmentKey(), SketchStatusEnum.PENDING);
            approvalSettings.setLocked(locked);
        }
        return approvalSettingsList;
    }

    private void archiveAllEnvironments(List<Environment> environments) {
        for (Environment environment : environments) {
            environment.setArchived(true);
            changeLogService.create(environment, ChangeLogType.DELETE);
        }
        environmentRepository.saveAll(environments);
    }

    private void validateLimit() {
        long total = projectRepository.count();
        FPUser user = new FPUser(String.valueOf(TokenHelper.getUserId()));
        user.with("account", TokenHelper.getAccount());
        double limitNum = SpringBeanManager.getBeanByType(FeatureProbe.class).numberValue(LIMITER_TOGGLE_KEY, user, -1);
        if (limitNum > 0 && total >= limitNum) {
            throw new ResourceOverflowException(ResourceType.PROJECT);
        }
    }

    private Project createProject(ProjectCreateRequest createRequest) {
        validateKey(createRequest.getKey());
        validateName(createRequest.getName());
        Project createProject = ProjectMapper.INSTANCE.requestToEntity(createRequest);
        createProject.setDeleted(false);
        List<Environment> defaultEnvs = createDefaultEnv(createProject);
        createProject.setEnvironments(defaultEnvs);
        Project saved = projectRepository.save(createProject);
        for (Environment environment : saved.getEnvironments()) {
            changeLogService.create(environment, ChangeLogType.ADD);
        }
        return saved;
    }

    public List<ProjectResponse> list(ProjectQueryRequest queryRequest) {
        List<Project> projects;
        if (StringUtils.isNotBlank(queryRequest.getKeyword())) {
            projects = projectRepository.findAllByNameContainsIgnoreCaseOrDescriptionContainsIgnoreCase(
                    queryRequest.getKeyword(), queryRequest.getKeyword());
        } else {
            projects = projectRepository.findAll();
        }
        return projects.stream().map(project ->
                ProjectMapper.INSTANCE.entityToResponse(project)).collect(Collectors.toList());
    }

    public ProjectResponse queryByKey(String key) {
        Project project = projectRepository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.PROJECT, key));
        return ProjectMapper.INSTANCE.entityToResponse(project);
    }

    private List<Environment> createDefaultEnv(Project project) {
        List<Environment> environments = new ArrayList<>();
        environments.add(createOnlineEnv(project));
        return environments;
    }

    private Environment createOnlineEnv(Project project) {
        Environment onlineEnv = new Environment();
        onlineEnv.setName("online");
        onlineEnv.setKey("online");
        onlineEnv.setProject(project);
        onlineEnv.setClientSdkKey(KeyGenerateUtil.getClientSdkKey());
        onlineEnv.setServerSdkKey(KeyGenerateUtil.getServerSdkKey());
        return onlineEnv;
    }

    public void validateExists(ValidateTypeEnum type, String value) {

        switch (type) {
            case KEY:
                validateKey(value);
                break;
            case NAME:
                validateName(value);
                break;
            default:
                break;
        }

    }

    private void validateKey(String key) {
        if (projectRepository.existsByKey(key)) {
            throw new ResourceConflictException(ResourceType.PROJECT);
        }
    }

    private void validateName(String name) {
        if (projectRepository.existsByName(name)) {
            throw new ResourceConflictException(ResourceType.PROJECT);
        }
    }

}
