package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByProjectKey(String projectKey);

    List<Tag> findByNameIn(List<String> names);

    Tag findByProjectKeyAndName(String projectKey, String name);

    Set<Tag> findByProjectKeyAndNameIn(String key, List<String> tagNames);
}
