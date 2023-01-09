package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.ToggleTagRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ToggleTagRepository extends JpaRepository<ToggleTagRelation, Long> {

    List<ToggleTagRelation> findByToggleKeyIn(List<String> toggleKeys);

    List<ToggleTagRelation> findByTagIdIn(Set<Long> tagIds);

}
