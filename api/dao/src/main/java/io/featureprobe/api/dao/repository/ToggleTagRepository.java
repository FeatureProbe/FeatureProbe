package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.ToggleTagRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ToggleTagRepository extends JpaRepository<ToggleTagRelation, Long> {

    List<ToggleTagRelation> findByToggleKeyIn(Set<String> toggleKeys);

    List<ToggleTagRelation> findByTagIdIn(Set<Long> tagIds);

}
