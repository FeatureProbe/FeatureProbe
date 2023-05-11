package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.Targeting;
import io.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

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
                                                                    Set<String> toggleKeys);


    List<Targeting> findAllByProjectKeyAndEnvironmentKey(String projectKey, String environmentKey);
}
