package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.TargetingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TargetingEventRepository extends JpaRepository<TargetingEvent, Long>,
        JpaSpecificationExecutor<TargetingEvent> {

    Optional<TargetingEvent> findByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey,
                                                                           String environmentKey,
                                                                           String toggleKey);

    void deleteByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey,
                                                         String environmentKey,
                                                         String toggleKey);
}
