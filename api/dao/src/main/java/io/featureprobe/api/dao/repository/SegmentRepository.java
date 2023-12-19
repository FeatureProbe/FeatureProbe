package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.Segment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SegmentRepository extends JpaRepository<Segment, Long>, JpaSpecificationExecutor<Segment> {

    Optional<Segment> findByProjectKeyAndKey(String projectKey, String key);

    List<Segment> findAllByProjectKeyAndOrganizationIdAndDeleted(String projectKey, Long organizationId,
                                                                 boolean deleted);

    boolean existsByProjectKeyAndKey(String projectKey, String key);

    boolean existsByProjectKeyAndName(String projectKey, String name);

    Optional<Segment> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<Segment> findById(Long id) {
        return findOneById(id);
    }

}
