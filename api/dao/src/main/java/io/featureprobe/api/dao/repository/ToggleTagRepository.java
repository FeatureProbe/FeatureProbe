package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.ToggleTagRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ToggleTagRepository extends JpaRepository<ToggleTagRelation, Long> {

    List<ToggleTagRelation> findByToggleKeyIn(Set<String> toggleKeys);

    List<ToggleTagRelation> findByTagIdIn(Set<Long> tagIds);

    Optional<ToggleTagRelation> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<ToggleTagRelation> findById(Long id) {
        return findOneById(id);
    }

}
