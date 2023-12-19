package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.SegmentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SegmentVersionRepository extends JpaRepository<SegmentVersion, Long>,
        JpaSpecificationExecutor<SegmentVersion> {

    Optional<SegmentVersion> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<SegmentVersion> findById(Long id) {
        return findOneById(id);
    }

}
