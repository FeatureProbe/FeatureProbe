package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {

    List<Attribute> findByProjectKey(String projectKey);

    Attribute findByProjectKeyAndKey(String projectKey, String key);

}
