package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Set;

@Repository
public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {

    List<Event> findBySdkKeyAndToggleKeyAndStartDateGreaterThanEqualAndEndDateLessThanEqual(String sdkKey,
                                                                                            String toggleKey,
                                                                                            Date startDate,
                                                                                            Date endDate);

    boolean existsBySdkKeyAndToggleKey(String sdkKey, String toggleKey);

    @Query(value = "SELECT toggle_key from event WHERE sdk_key = ?1 OR sdk_key = ?2 GROUP BY toggle_key",
            nativeQuery = true)
    Set<String> findAllAccessedToggleKey(String serverSdkKey, String clientSdkKey);

    @Query(value = "SELECT toggle_key from event WHERE ( sdk_key = ?1 OR sdk_key = ?2 ) " +
            "AND end_date >= ?3 GROUP BY toggle_key", nativeQuery = true)
    Set<String> findAllAccessedToggleKeyGreaterThanOrEqualToEndDate(String serverSdkKey, String clientSdkKey,
                                                                    Date time);

}
