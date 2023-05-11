package io.featureprobe.api.service;

import io.featureprobe.api.dto.AttributeRequest;
import io.featureprobe.api.dto.AttributeResponse;
import io.featureprobe.api.dao.entity.Attribute;
import io.featureprobe.api.mapper.AttributeMapper;
import io.featureprobe.api.dao.repository.AttributeRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class AttributeService {

    private AttributeRepository attributeRepository;

    @Transactional(rollbackFor = Exception.class)
    public AttributeResponse create(String projectKey, AttributeRequest attributeRequest) {
        Attribute attribute = new Attribute();
        attribute.setProjectKey(projectKey);
        attribute.setKey(attributeRequest.getKey());
        return AttributeMapper.INSTANCE.entityToResponse(attributeRepository.save(attribute));

    }

    public List<String> queryByProjectKey(String projectKey) {
        List<Attribute> attributes = attributeRepository.findByProjectKey(projectKey);
        return attributes.stream().map(Attribute::getKey).collect(Collectors.toList());
    }
}
