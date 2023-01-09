package com.featureprobe.api.hook;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import com.featureprobe.api.base.hook.ICallback;
import com.featureprobe.api.base.hook.IHookQueue;
import com.featureprobe.api.base.hook.IHookRuleBuilder;
import com.featureprobe.api.base.model.HookContext;
import com.featureprobe.api.dao.entity.WebHookSettings;
import com.featureprobe.api.dao.repository.WebHookSettingsRepository;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Slf4j
@Component
public class HookProcessor {

    private final WebHookSettingsRepository webHookSettingsRepository;

    private ApplicationEventPublisher eventPublisher;

    private final IHookRuleBuilder hookRuleBuilder;

    private final AtomicBoolean closed = new AtomicBoolean(false);


    ThreadFactory threadFactory = new ThreadFactoryBuilder()
            .setDaemon(true)
            .setNameFormat("FeatureProbe-API-Hook-Processor-%d")
            .setPriority(1)
            .build();


    public HookProcessor(IHookQueue hookQueue, WebHookSettingsRepository webHookSettingsRepository,
                         ApplicationEventPublisher eventPublisher, IHookRuleBuilder hookRuleBuilder) {
        this.webHookSettingsRepository = webHookSettingsRepository;
        this.eventPublisher = eventPublisher;
        this.hookRuleBuilder = hookRuleBuilder;
        Thread hookProcessorThread =  threadFactory.newThread(() -> {
            handleHook(hookQueue);
        });
        hookProcessorThread.setDaemon(true);
        hookProcessorThread.start();
    }

    private void handleHook(IHookQueue hookQueue) {
        while (!closed.get()) {
            try {
                HookContext hookContext = hookQueue.take();
                List<WebHookSettings> webHookSettingsList = webHookSettingsRepository
                        .findAllByOrganizationIdAndStatus(hookContext.getOrganizationId(), HookSettingsStatus.ENABLE);
                List<WebHook> webHooks = webHookSettingsList.stream()
                        .map(webHookSettings -> translateHookConfig(webHookSettings)).filter(x -> x!=null)
                        .collect(Collectors.toList());
                for(WebHook webHook : webHooks) {
                    webHook.callback(hookContext, eventPublisher);
                }
            } catch (Exception e) {
                log.error("FeatureProbe hook process error", e);
            }
        }
    }


    private WebHook translateHookConfig(WebHookSettings webHookSettings) {
        WebHook webHook = new WebHook();
        webHook.setName(webHookSettings.getName());
        webHook.setUrl(webHookSettings.getUrl());
        webHook.setOrganizationId(webHookSettings.getOrganizationId());
        webHook.setRule(hookRuleBuilder.build(webHookSettings.getId()));
        webHook.setSecretKey(webHookSettings.getSecretKey());
        ICallback callback = CallbackAbilityContainer.get(webHookSettings.getType());
        if (Objects.isNull(callback)) {
            return null;
        }
        webHook.setHook(callback);
        return webHook;
    }

}
