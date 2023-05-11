package io.featureprobe.api.service;

import io.featureprobe.api.auth.TokenHelper;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dto.DictionaryResponse;
import io.featureprobe.api.dao.entity.Dictionary;
import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.mapper.DictionaryMapper;
import io.featureprobe.api.dao.repository.DictionaryRepository;
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
