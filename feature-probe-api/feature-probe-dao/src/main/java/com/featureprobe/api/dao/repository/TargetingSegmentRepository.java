package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.TargetingSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TargetingSegmentRepository extends JpaRepository<TargetingSegment, Long>,
        JpaSpecificationExecutor<TargetingSegment> {

    void deleteByTargetingId(Long targetingId);

    List<TargetingSegment> findByProjectKeyAndSegmentKey(String projectKey, String segmentKey);

    int countByProjectKeyAndSegmentKey(String projectKey, String segmentKey);


}
