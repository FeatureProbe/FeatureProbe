package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.TrafficCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrafficCacheRepository extends JpaRepository<TrafficCache, Long>,
        JpaSpecificationExecutor<TrafficCache> {

    @Modifying
    @Query(value = "delete from traffic_cache where sdk_key =:sdkKey AND toggle_key=:toggleKey",nativeQuery = true)
    void deleteBySdkKeyAndToggleKey(String sdkKey, String toggleKey);

    Optional<TrafficCache> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<TrafficCache> findById(Long id) {
        return findOneById(id);
    }
}
