package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.ApprovalRecord;
import io.featureprobe.api.base.enums.ApprovalStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprovalRecordRepository extends JpaRepository<ApprovalRecord, Long>,
        JpaSpecificationExecutor<ApprovalRecord> {

    long countByStatusAndReviewersIsContaining(ApprovalStatusEnum status, String account);
}
