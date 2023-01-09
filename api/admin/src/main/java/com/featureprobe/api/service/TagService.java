package com.featureprobe.api.service;

import com.featureprobe.api.dto.TagRequest;
import com.featureprobe.api.dto.TagResponse;
import com.featureprobe.api.dao.entity.Tag;
import com.featureprobe.api.mapper.TagMapper;
import com.featureprobe.api.dao.repository.TagRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class TagService {

    private TagRepository tagRepository;

    @PersistenceContext
    public EntityManager entityManager;

    public List<TagResponse> queryByProjectKey(String projectKey) {
        List<Tag> tags = tagRepository.findByProjectKey(projectKey);
        return tags.stream().map(TagMapper.INSTANCE::entityToResponse).collect(Collectors.toList());
    }

    public TagResponse create(String projectKey, TagRequest tagRequest) {
        Tag tag = tagRepository.findByProjectKeyAndName(projectKey, tagRequest.getName());
        if (tag == null) {
            tag = TagMapper.INSTANCE.requestToEntity(tagRequest);
            tag.setProjectKey(projectKey);
            tag.setDeleted(false);
            tagRepository.save(tag);
        }
        return TagMapper.INSTANCE.entityToResponse(tag);
    }
}
