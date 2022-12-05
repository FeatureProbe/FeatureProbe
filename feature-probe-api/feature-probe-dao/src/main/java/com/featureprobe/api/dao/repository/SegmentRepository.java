package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Segment;
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

}
