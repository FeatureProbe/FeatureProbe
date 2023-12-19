package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.TargetingSegment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TargetingSegmentRepository extends JpaRepository<TargetingSegment, Long>,
        JpaSpecificationExecutor<TargetingSegment> {

    void deleteByTargetingId(Long targetingId);

    List<TargetingSegment> findByProjectKeyAndSegmentKey(String projectKey, String segmentKey);

    int countByProjectKeyAndSegmentKey(String projectKey, String segmentKey);

    Optional<TargetingSegment> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<TargetingSegment> findById(Long id) {
        return findOneById(id);
    }

}
