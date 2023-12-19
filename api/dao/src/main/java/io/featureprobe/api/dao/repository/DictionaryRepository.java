package io.featureprobe.api.dao.repository;


import io.featureprobe.api.dao.entity.Dictionary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface DictionaryRepository extends JpaRepository<Dictionary, Long>, JpaSpecificationExecutor<Dictionary> {

    Optional<Dictionary> findByAccountAndKey(String account, String key);

    Optional<Dictionary> findByKey(String key);

    Optional<Dictionary> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<Dictionary> findById(Long id) {
        return findOneById(id);
    }

}
