package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.TrafficCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TrafficCacheRepository extends JpaRepository<TrafficCache, Long>,
        JpaSpecificationExecutor<TrafficCache> {

    @Modifying
    @Query(value = "delete from traffic_cache where sdk_key =:sdkKey AND toggle_key=:toggleKey",nativeQuery = true)
    void deleteBySdkKeyAndToggleKey(String sdkKey, String toggleKey);

}
