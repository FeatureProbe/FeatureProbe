package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.Prerequisite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Long>,
        JpaSpecificationExecutor<Prerequisite> {

    Page<Prerequisite> findAllByProjectKeyAndEnvironmentKeyAndParentToggleKey(String projectKey, String environmentKey,
                                                                              String parentToggleKey, Pageable pageable);

    void deleteAllByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey, String environmentKey,
                                                            String toggleKey);

    Optional<Prerequisite> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<Prerequisite> findById(Long id) {
        return findOneById(id);
    }

}
