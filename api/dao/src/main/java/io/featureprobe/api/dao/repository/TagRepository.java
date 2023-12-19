package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findByProjectKey(String projectKey);

    List<Tag> findByNameIn(List<String> names);

    Tag findByProjectKeyAndName(String projectKey, String name);

    Set<Tag> findByProjectKeyAndNameIn(String key, List<String> tagNames);

    Optional<Tag> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<Tag> findById(Long id) {
        return findOneById(id);
    }
}
