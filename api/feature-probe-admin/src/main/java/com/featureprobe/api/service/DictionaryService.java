package com.featureprobe.api.service;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dto.DictionaryResponse;
import com.featureprobe.api.dao.entity.Dictionary;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.mapper.DictionaryMapper;
import com.featureprobe.api.dao.repository.DictionaryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
@Slf4j
public class DictionaryService {

    private DictionaryRepository dictionaryRepository;


    public DictionaryResponse create(String key, String value) {
        Optional<Dictionary> dictionaryOptional = dictionaryRepository
                .findByAccountAndKey(TokenHelper.getAccount(), key);
        if (dictionaryOptional.isPresent()) {
            Dictionary dictionary = dictionaryOptional.get();
            dictionary.setValue(value);
            dictionary.setAccount(TokenHelper.getAccount());
            return DictionaryMapper.INSTANCE.entityToResponse(dictionaryRepository.save(dictionary));
        }
        Dictionary dictionary = new Dictionary();
        dictionary.setKey(key);
        dictionary.setValue(value);
        dictionary.setAccount(TokenHelper.getAccount());
        return DictionaryMapper.INSTANCE.entityToResponse(dictionaryRepository.save(dictionary));
    }

    public DictionaryResponse query(String key) {
        Dictionary dictionary = dictionaryRepository.findByAccountAndKey(TokenHelper.getAccount(), key)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.DICTIONARY, key));
        return DictionaryMapper.INSTANCE.entityToResponse(dictionary);
    }

}
