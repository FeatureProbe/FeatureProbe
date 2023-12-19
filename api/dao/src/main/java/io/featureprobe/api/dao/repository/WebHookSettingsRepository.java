package io.featureprobe.api.dao.repository;

import io.featureprobe.api.base.hook.HookSettingsStatus;
import io.featureprobe.api.dao.entity.WebHookSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WebHookSettingsRepository extends JpaRepository<WebHookSettings, Long>,
        JpaSpecificationExecutor<WebHookSettings> {


    List<WebHookSettings> findAllByOrganizationIdAndStatus(Long organizationId, HookSettingsStatus status);

    Optional<WebHookSettings> findByName(String name);

    Optional<WebHookSettings> findByOrganizationIdAndName(Long organizationId, String name);

    List<WebHookSettings> findByUrl(String url);

    Optional<WebHookSettings> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<WebHookSettings> findById(Long id) {
        return findOneById(id);
    }
}
