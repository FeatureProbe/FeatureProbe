package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Traffic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface TrafficRepository extends JpaRepository<Traffic, Long>, JpaSpecificationExecutor<Traffic> {

    List<Traffic> findBySdkKeyAndToggleKeyAndStartDateGreaterThanEqualAndEndDateLessThanEqual(String sdkKey,
                                                                                              String toggleKey,
                                                                                              Date startDate,
                                                                                              Date endDate);
    List<Traffic> findAllBySdkKeyAndStartDateGreaterThanEqual(String sdkKey, Date start);

    boolean existsBySdkKeyAndToggleKey(String sdkKey, String toggleKey);

    boolean existsBySdkKeyAndToggleKeyAndSdkType(String sdkKey, String toggleKey, String sdkType);

    @Query(value = "SELECT toggle_key from traffic WHERE sdk_key = ?1 OR sdk_key = ?2 GROUP BY toggle_key",
            nativeQuery = true)
    Set<String> findAllAccessedToggleKey(String serverSdkKey, String clientSdkKey);

    @Query(value = "SELECT toggle_key from traffic WHERE ( sdk_key = ?1 OR sdk_key = ?2 ) " +
            "AND end_date >= ?3 GROUP BY toggle_key", nativeQuery = true)
    Set<String> findAllAccessedToggleKeyGreaterThanOrEqualToEndDate(String serverSdkKey, String clientSdkKey,
                                                                    Date time);

}
