package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.ApprovalRecord;
import io.featureprobe.api.base.enums.ApprovalStatusEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApprovalRecordRepository extends JpaRepository<ApprovalRecord, Long>,
        JpaSpecificationExecutor<ApprovalRecord> {

    long countByStatusAndReviewersIsContaining(ApprovalStatusEnum status, String account);

    Optional<ApprovalRecord> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<ApprovalRecord> findById(Long id) {
        return findOneById(id);
    }
}
