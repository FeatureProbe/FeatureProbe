package com.featureprobe.api.component;

import com.featureprobe.api.base.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@AllArgsConstructor
public class I18nConverter {

    private MessageSource messageSource;

    public String get(String msgKey) {
        try {
            return messageSource.getMessage(msgKey, null, LocaleContextHolder.getLocale());
        } catch (Exception e) {
            log.error("i18n language conversion failed", e);
            return msgKey;
        }
    }

    public String get(String msgKey, Object[] args) {
        try {
            return messageSource.getMessage(msgKey, args, LocaleContextHolder.getLocale());
        } catch (Exception e) {
            log.error("i18n language conversion failed", e);
            return msgKey;
        }
    }

    public String getResourceNameMessage(ResourceType resourceType) {
        return get("resource." + resourceType.name().toLowerCase());
    }
}
