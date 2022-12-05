package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Toggle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ToggleRepository extends JpaRepository<Toggle, Long>, JpaSpecificationExecutor<Toggle> {

    Page<Toggle> findAllByProjectKeyAndArchived(String projectKey, Boolean archived, Pageable pageable);

    Optional<Toggle> findByProjectKeyAndKey(String projectKey, String key);

    Optional<Toggle> findByProjectKeyAndKeyAndArchived(String projectKey, String key, Boolean archived);

    List<Toggle> findAllByProjectKey(String projectKey);

    List<Toggle> findByKeyIn(Set<String> keys);

    List<Toggle> findAllByProjectKeyAndOrganizationIdAndArchivedAndDeleted(String projectKey, Long organizationId,
                                                                           boolean archived, boolean deleted);

    long countByProjectKey(String projectKey);

    boolean existsByProjectKeyAndKey(String projectKey, String key);

    boolean existsByProjectKeyAndName(String projectKey, String key);

    List<Toggle> findByNameLike(String name);

}
