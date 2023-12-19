package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.EventTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventTrackerRepository extends JpaRepository<EventTracker, Long>,
        JpaSpecificationExecutor<EventTracker> {

    Optional<EventTracker> findByProjectKeyAndEnvironmentKeyAndUuid(String projectKey, String environmentKey,
                                                                    String uuid);

    Optional<EventTracker> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<EventTracker> findById(Long id) {
        return findOneById(id);
    }

}

