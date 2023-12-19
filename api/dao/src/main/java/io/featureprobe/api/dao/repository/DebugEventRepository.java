package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.DebugEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DebugEventRepository extends JpaRepository<DebugEvent, Long>,
        JpaSpecificationExecutor<DebugEvent> {

    List<DebugEvent> findAllBySdkKeyAndTimeGreaterThanEqual(String sdkKey, Long time);

    Optional<DebugEvent> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<DebugEvent> findById(Long id) {
        return findOneById(id);
    }

}
