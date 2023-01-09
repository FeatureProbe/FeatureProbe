package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.ServerSegmentEntity;
import com.featureprobe.api.dao.entity.ServerToggleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface EnvironmentRepository extends JpaRepository<Environment, Long> {

    List<Environment> findAllByProjectKey(String projectKey);

    List<Environment> findByKeyIn(Set<String> key);

    List<Environment> findAllByProjectKeyAndArchived(String projectKey, Boolean archived);

    long countByProjectKey(String projectKey);

    Optional<Environment> findByServerSdkKey(String serverSdkKey);

    Optional<Environment> findByServerSdkKeyOrClientSdkKey(String serverSdkKey, String clientSdkKey);

    boolean existsByProjectKeyAndKey(String projectKey, String key);

    boolean existsByProjectKeyAndName(String projectKey, String name);

    Optional<Environment> findByProjectKeyAndKey(String projectKey, String key);

    Optional<Environment> findByProjectKeyAndKeyAndArchived(String projectKey, String key, Boolean archived);

    List<Environment> findAllByArchivedAndDeleted(boolean archived, boolean deleted);

    @Query(value = "SELECT env.organization_id as organizationId,\n" +
            "       env.project_key as  projectKey,\n" +
            "       env.`key` as envKey,\n" +
            "       env.client_sdk_key as clientSdkKey,\n" +
            "       env.server_sdk_key as serverSdkKey,\n" +
            "       env.version as envVersion, tg.`key` as toggleKey,\n" +
            "       tg.return_type as returnType,\n" +
            "       tg.client_availability as ClientAvailability,\n" +
            "       ta.version as targetingVersion,\n" +
            "       ta.disabled as targetingDisabled,\n" +
            "       ta.content as targetingContent\n" +
            "FROM environment env\n" +
            "    LEFT JOIN (SELECT * FROM toggle WHERE deleted = 0 AND archived = 0) tg\n" +
            "        ON env.organization_id = tg.organization_id AND env.project_key=tg.project_key\n" +
            "    LEFT JOIN (SELECT * FROM targeting WHERE deleted = 0) ta\n" +
            "         ON tg.organization_id=ta.organization_id AND\n" +
            "                               tg.project_key = ta.project_key AND tg.`key`=ta.toggle_key\n" +
            "         WHERE env.archived = 0 AND env.deleted = 0;",
            nativeQuery = true)
    List<ServerToggleEntity> findAllServerToggle();

    @Query(value = "SELECT pro.organization_id as organizationId, \n" +
            "       pro.`key` as projectKey, \n" +
            "       s.`key` as segmentKey,\n" +
            "       s.rules as segmentRules, \n" +
            "       s.version as segmentVersion, \n" +
            "       s.unique_key as segmentUniqueKey\n" +
            "FROM project pro INNER JOIN segment s on pro.organization_id=s.organization_id AND pro.`key` = s.project_key\n" +
            "WHERE pro.archived = 0 AND pro.deleted = 0 AND s.deleted = 0",
            nativeQuery = true)
    List<ServerSegmentEntity> findAllServerSegment();
}
