package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.ApprovalRecord;
import com.featureprobe.api.base.enums.ApprovalStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApprovalRecordRepository extends JpaRepository<ApprovalRecord, Long>,
        JpaSpecificationExecutor<ApprovalRecord> {

    long countByStatusAndReviewersIsContaining(ApprovalStatusEnum status, String account);
}
