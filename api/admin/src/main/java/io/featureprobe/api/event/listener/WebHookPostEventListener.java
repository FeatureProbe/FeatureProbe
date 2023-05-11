package io.featureprobe.api.event.listener;

import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.enums.WebHookCallbackStatus;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.dao.entity.WebHookSettings;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.WebHookSettingsRepository;
import io.featureprobe.api.event.WebHookPostEvent;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class WebHookPostEventListener implements ApplicationListener<WebHookPostEvent> {

    private WebHookSettingsRepository settingsRepository;

    @Override
    public void onApplicationEvent(WebHookPostEvent event) {
        WebHookSettings webHookSettings = settingsRepository.findByOrganizationIdAndName(event.getOrganizationId(),
                event.getName()).orElseThrow(() -> new ResourceNotFoundException(ResourceType.WEBHOOK,
                event.getOrganizationId() + "-" + event.getName()));
        webHookSettings.setLastedTime(event.getCallbackResult().getTime());
        webHookSettings.setLastedStatus(event.getCallbackResult().isSuccess() ?
                WebHookCallbackStatus.SUCCESS.name() : WebHookCallbackStatus.FAIL.name());
        webHookSettings.setLastedStatusCode(event.getCallbackResult().getStatusCode());
        TenantContext.setCurrentTenant(String.valueOf(event.getOrganizationId()));
        settingsRepository.save(webHookSettings);
    }

}
