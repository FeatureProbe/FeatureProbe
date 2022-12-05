package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TargetingRepository extends JpaRepository<Targeting, Long>, JpaSpecificationExecutor<Targeting> {

    Optional<Targeting> findByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey, String environmentKey,
                                                                      String toggleKey);

    List<Targeting> findAllByProjectKeyAndEnvironmentKeyAndDisabled(String projectKey, String environmentKey,
                                                                    boolean disabled);

    List<Targeting> findAllByProjectKeyAndEnvironmentKeyAndStatusIn(String projectKey, String environmentKey,
                                                                    List<ToggleReleaseStatusEnum> statusList);

    List<Targeting> findAllByProjectKeyAndEnvironmentKeyAndOrganizationIdAndDeleted(String projectKey,
                                                                                    String environmentKey,
                                                                                    Long organizationId,
                                                                                    boolean deleted);

    List<Targeting> findByProjectKeyAndEnvironmentKeyAndToggleKeyIn(String projectKey, String environmentKey,
                                                                    List<String> toggleKeys);
}
