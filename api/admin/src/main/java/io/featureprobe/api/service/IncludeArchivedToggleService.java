package io.featureprobe.api.service;

import io.featureprobe.api.dao.entity.Toggle;
import io.featureprobe.api.dao.exception.ResourceConflictException;
import io.featureprobe.api.dao.repository.ToggleRepository;
import io.featureprobe.api.base.db.Archived;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.enums.ValidateTypeEnum;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@AllArgsConstructor
@Service
public class IncludeArchivedToggleService {

    private ToggleRepository toggleRepository;

    @PersistenceContext
    public EntityManager entityManager;


    @Archived
    public List<Toggle> findAllByProjectKey(String projectKey) {
        return toggleRepository.findAllByProjectKey(projectKey);
    }

    @Archived
    public void validateIncludeArchivedToggle(String projectKey, ValidateTypeEnum type, String value) {
        switch (type) {
            case KEY:
                validateIncludeArchivedToggleByKey(projectKey, value);
                break;
            case NAME:
                validateIncludeArchivedToggleByName(projectKey, value);
                break;
            default:
                break;
        }
    }

    @Archived
    public void validateIncludeArchivedToggleByName(String projectKey, String name) {
        if (toggleRepository.existsByProjectKeyAndName(projectKey, name)) {
            throw new ResourceConflictException(ResourceType.ENVIRONMENT);
        }
    }

    @Archived
    public void validateIncludeArchivedToggleByKey(String projectKey, String key) {
        if (toggleRepository.existsByProjectKeyAndKey(projectKey, key)) {
            throw new ResourceConflictException(ResourceType.ENVIRONMENT);
        }
    }

}
