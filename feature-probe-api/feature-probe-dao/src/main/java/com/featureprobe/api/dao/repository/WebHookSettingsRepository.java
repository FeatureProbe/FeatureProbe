package com.featureprobe.api.dao.repository;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import com.featureprobe.api.dao.entity.WebHookSettings;
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


}
