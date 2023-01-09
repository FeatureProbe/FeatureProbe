package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.SegmentVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SegmentVersionRepository extends JpaRepository<SegmentVersion, Long>,
        JpaSpecificationExecutor<SegmentVersion> {

}
