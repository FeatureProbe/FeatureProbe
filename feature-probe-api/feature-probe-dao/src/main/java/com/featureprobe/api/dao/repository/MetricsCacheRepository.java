package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.MetricsCache;
import com.featureprobe.api.base.enums.MetricsCacheTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.Optional;

@Repository
public interface MetricsCacheRepository extends JpaRepository<MetricsCache, Long>,
        JpaSpecificationExecutor<MetricsCache> {

    Optional<MetricsCache> findBySdkKeyAndToggleKeyAndStartDateAndEndDateAndType(String sdkKey, String toggleKey,
                                                                                 Date startDate, Date endDate,
                                                                                 MetricsCacheTypeEnum type);

    @Modifying
    @Query(value = "delete from user where sdk_key =:sdkKey AND toggle_key=:toggleKey",nativeQuery = true)
    void deleteBySdkKeyAndToggleKey(String sdkKey, String toggleKey);

}
