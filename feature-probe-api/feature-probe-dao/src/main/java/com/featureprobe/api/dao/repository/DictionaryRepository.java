package com.featureprobe.api.dao.repository;


import com.featureprobe.api.dao.entity.Dictionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface DictionaryRepository extends JpaRepository<Dictionary, Long>, JpaSpecificationExecutor<Dictionary> {

    Optional<Dictionary> findByAccountAndKey(String account, String key);

    Optional<Dictionary> findByKey(String key);

}
