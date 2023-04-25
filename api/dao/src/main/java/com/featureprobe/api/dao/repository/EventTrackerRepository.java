package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.EventTracker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EventTrackerRepository extends JpaRepository<EventTracker, Long>,
        JpaSpecificationExecutor<EventTracker> {

    Optional<EventTracker> findByProjectKeyAndEnvironmentKeyAndUuid(String projectKey, String environmentKey,
                                                                    String uuid);
}
