package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.MetricIteration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MetricIterationRepository extends JpaRepository<MetricIteration, Long>,
        JpaSpecificationExecutor<MetricIteration> {


    List<MetricIteration> findAllByProjectKeyAndEnvironmentKeyAndToggleKeyOrderByStartAsc(String projectKey,
                                                                                          String environmentKey,
                                                                                          String toggleKey);




}
