package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Prerequisite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Long>,
        JpaSpecificationExecutor<Prerequisite> {

    Page<Prerequisite> findAllByProjectKeyAndEnvironmentKeyAndParentToggleKey(String projectKey, String environmentKey,
                                                                              String parentToggleKey, Pageable pageable);

    void deleteAllByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey, String environmentKey,
                                                            String toggleKey);

}
