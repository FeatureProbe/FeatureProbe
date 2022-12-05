package com.featureprobe.api.service;

import com.featureprobe.api.dao.entity.PublishMessage;
import com.featureprobe.api.dao.entity.Dictionary;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.PublishMessageRepository;
import com.featureprobe.api.dao.repository.DictionaryRepository;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.ResourceType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@ExcludeTenant
public class ChangeLogService {

    private PublishMessageRepository publishMessageRepository;

    private EnvironmentRepository environmentRepository;

    private DictionaryRepository dictionaryRepository;

    private static final String SDK_KEY_MAP_VERSION_DICT_KEY = "all_sdk_key_map";

    @Transactional(rollbackFor = Exception.class)
    public void create(Environment environment, ChangeLogType type) {
        switch (type) {
            case ADD:
            case DELETE:
                Dictionary dictionary = dictionaryRepository.findByKey(SDK_KEY_MAP_VERSION_DICT_KEY)
                        .orElseThrow(() -> new ResourceNotFoundException(ResourceType.DICTIONARY,
                                SDK_KEY_MAP_VERSION_DICT_KEY));
                dictionary.setValue(String.valueOf(Long.parseLong(dictionary.getValue()) + 1));
                dictionaryRepository.save(dictionary);
                break;
            case CHANGE:
                environment.setVersion(environment.getVersion() + 1);
                environmentRepository.save(environment);
                break;
            default:
                break;
        }
        PublishMessage publishMessage = new PublishMessage();
        publishMessage.setClientSdkKey(environment.getClientSdkKey());
        publishMessage.setServerSdkKey(environment.getServerSdkKey());
        publishMessage.setType(type);
        publishMessageRepository.save(publishMessage);
    }

}
