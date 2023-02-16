package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.ToggleControlConf;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ToggleControlConfRepository extends JpaRepository<ToggleControlConf, Long>,
        JpaSpecificationExecutor<ToggleControlConf> {

    Optional<ToggleControlConf> findByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey, String environmentKey,
                                                                      String toggleKey);

    List<ToggleControlConf> findByProjectKeyAndEnvironmentKeyAndOrganizationId(String projectKey,
                                                                               String environmentKey,
                                                                               Long organizationId);

}
