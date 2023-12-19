package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.TargetingVersion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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

    List<TargetingVersion>
    findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndCreatedTimeGreaterThanEqualOrderByVersionDesc(
            String projectKey,
            String environmentKey,
            String toggleKey,
            Date start);

    long countByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey, String environmentKey, String toggleKey);

    Optional<TargetingVersion> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<TargetingVersion> findById(Long id) {
        return findOneById(id);
    }

}
