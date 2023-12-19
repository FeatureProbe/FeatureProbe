package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.MetricIteration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MetricIterationRepository extends JpaRepository<MetricIteration, Long>,
        JpaSpecificationExecutor<MetricIteration> {


    List<MetricIteration> findAllByProjectKeyAndEnvironmentKeyAndToggleKeyOrderByStartAsc(String projectKey,
                                                                                          String environmentKey,
                                                                                          String toggleKey);


    Optional<MetricIteration> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<MetricIteration> findById(Long id) {
        return findOneById(id);
    }


}
