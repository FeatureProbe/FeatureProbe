package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MetricRepository extends JpaRepository<Metric, Long>, JpaSpecificationExecutor<Metric> {

    Optional<Metric> findByProjectKeyAndEnvironmentKeyAndToggleKey(String projectKey,
                                                                   String environmentKey,
                                                                   String toggleKey);

    Optional<Metric> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<Metric> findById(Long id) {
        return findOneById(id);
    }


}
