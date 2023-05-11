package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.DebugEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebugEventRepository extends JpaRepository<DebugEvent, Long>,
        JpaSpecificationExecutor<DebugEvent> {

    List<DebugEvent> findAllBySdkKeyAndTimeGreaterThanEqual(String sdkKey, Long time);

}
