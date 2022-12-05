package com.featureprobe.api.service;

import com.featureprobe.api.dao.exception.ResourceConflictException;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.base.db.Archived;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.base.enums.ValidateTypeEnum;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@AllArgsConstructor
@Service
public class IncludeArchivedEnvironmentService {

    private EnvironmentRepository environmentRepository;

    @PersistenceContext
    public EntityManager entityManager;

    @Archived
    public void validateIncludeArchivedEnvironment(String projectKey, ValidateTypeEnum type, String value) {
        switch (type) {
            case KEY:
                validateIncludeArchivedEnvironmentByKey(projectKey, value);
                break;
            case NAME:
                validateIncludeArchivedEnvironmentByName(projectKey, value);
                break;
            default:
                break;
        }
    }

    @Archived
    public void validateIncludeArchivedEnvironmentByName(String projectKey, String name) {
        if (environmentRepository.existsByProjectKeyAndName(projectKey, name)) {
            throw new ResourceConflictException(ResourceType.ENVIRONMENT);
        }
    }

    @Archived
    public void validateIncludeArchivedEnvironmentByKey(String projectKey, String key) {
        if (environmentRepository.existsByProjectKeyAndKey(projectKey, key)) {
            throw new ResourceConflictException(ResourceType.ENVIRONMENT);
        }
    }
}
