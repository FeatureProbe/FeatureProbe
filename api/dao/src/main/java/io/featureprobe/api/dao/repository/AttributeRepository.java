package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttributeRepository extends JpaRepository<Attribute, Long> {

    List<Attribute> findByProjectKey(String projectKey);

    Attribute findByProjectKeyAndKey(String projectKey, String key);

    Optional<Attribute> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<Attribute> findById(Long id) {
        return findOneById(id);
    }

}
