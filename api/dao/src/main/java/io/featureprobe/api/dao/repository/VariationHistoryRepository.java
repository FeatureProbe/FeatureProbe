package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.VariationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VariationHistoryRepository extends JpaRepository<VariationHistory, Long>,
        JpaSpecificationExecutor<VariationHistory> {


    List<VariationHistory> findByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey,
                                                                         String environmentKey, String toggleKey);

    Optional<VariationHistory> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<VariationHistory> findById(Long id) {
        return findOneById(id);
    }
}
