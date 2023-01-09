package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.TargetingVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TargetingVersionRepository extends JpaRepository<TargetingVersion, Long>,
        JpaSpecificationExecutor<TargetingVersion> {

    Page<TargetingVersion>
    findAllByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey,
                                                     String environmentKey,
                                                     String toggleKey,
                                                     Pageable pageable);

    Page<TargetingVersion>
    findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndVersionLessThanOrderByVersionDesc(String projectKey,
                                                                                         String environmentKey,
                                                                                         String toggleKey,
                                                                                         Long version,
                                                                                         Pageable pageable);


    List<TargetingVersion>
    findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndVersionGreaterThanEqualOrderByVersionDesc(String projectKey,
                                                                                                 String environmentKey,
                                                                                                 String toggleKey,
                                                                                                 Long version);

    long countByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey, String environmentKey, String toggleKey);

}
