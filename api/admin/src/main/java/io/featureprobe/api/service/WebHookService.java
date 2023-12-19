package io.featureprobe.api.service;

import io.featureprobe.api.base.enums.ResourceType;
import io.featureprobe.api.base.hook.CallbackType;
import io.featureprobe.api.dao.entity.WebHookSettings;
import io.featureprobe.api.dao.exception.ResourceConflictException;
import io.featureprobe.api.dao.exception.ResourceNotFoundException;
import io.featureprobe.api.dao.repository.WebHookSettingsRepository;
import io.featureprobe.api.dao.utils.PageRequestUtil;
import io.featureprobe.api.dto.SecretKeyResponse;
import io.featureprobe.api.dto.WebHookCreateRequest;
import io.featureprobe.api.dto.WebHookItemResponse;
import io.featureprobe.api.dto.WebHookListRequest;
import io.featureprobe.api.dto.WebHookResponse;
import io.featureprobe.api.dto.WebHookUpdateRequest;
import io.featureprobe.api.mapper.WebHookMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.Predicate;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class WebHookService {

    private WebHookSettingsRepository webHookSettingsRepository;

    @PersistenceContext
    public EntityManager entityManager;

    @Transactional(rollbackFor = Exception.class)
    public WebHookResponse create(WebHookCreateRequest createRequest) {
        checkName(createRequest.getName());
        checkUrl(createRequest.getUrl());
        WebHookSettings webHookSettings = WebHookMapper.INSTANCE.requestToEntity(createRequest);
        webHookSettings.setType(CallbackType.COMMON);
        return WebHookMapper.INSTANCE.entityToResponse(webHookSettingsRepository.save(webHookSettings));
    }


    @Transactional(rollbackFor = Exception.class)
    public WebHookResponse update(Long id, WebHookUpdateRequest updateRequest) {
        WebHookSettings webHookSettings = webHookSettingsRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.WEBHOOK, String.valueOf(id)));
        if (!webHookSettings.getName().equals(updateRequest.getName())) {
            checkName(updateRequest.getName());
        }
        checkUrl(updateRequest.getUrl());
        WebHookMapper.INSTANCE.mapEntity(updateRequest, webHookSettings);
        return WebHookMapper.INSTANCE.entityToResponse(webHookSettingsRepository.save(webHookSettings));
    }

    public SecretKeyResponse secretKey() {
        return new SecretKeyResponse(DigestUtils.sha1Hex(UUID.randomUUID().toString()
                .getBytes(StandardCharsets.UTF_8)));
    }

    @Transactional(rollbackFor = Exception.class)
    public WebHookResponse delete(Long id) {
        WebHookSettings webHookSettings = webHookSettingsRepository.findById(id).orElseThrow(() ->
                new ResourceNotFoundException(ResourceType.WEBHOOK, String.valueOf(id)));
        webHookSettingsRepository.deleteById(id);
        return WebHookMapper.INSTANCE.entityToResponse(webHookSettings);
    }

    public WebHookItemResponse query(Long id) {
        WebHookSettings webHookSettings = webHookSettingsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.WEBHOOK, String.valueOf(id)));
        return WebHookMapper.INSTANCE.entityToItemResponse(webHookSettings);
    }

    public List<String> queryByUrl(String url) {
        List<WebHookSettings> webHookSettingsList = webHookSettingsRepository.findByUrl(url);
        return webHookSettingsList.stream().map(WebHookSettings::getName).collect(Collectors.toList());
    }

    public Page<WebHookItemResponse> list(WebHookListRequest listRequest) {
        Specification<WebHookSettings> resultSpec = (root, query, cb) -> {
            List<Predicate> predicateListOr = new ArrayList<>();
            if (StringUtils.isNotBlank(listRequest.getNameLike())) {
                predicateListOr.add(cb.like(root.get("name"), "%" + listRequest.getNameLike() + "%"));
            }
            if (Objects.nonNull(listRequest.getStatus())) {
                predicateListOr.add(cb.equal(root.get("status"), listRequest.getStatus()));
            }
            if (predicateListOr.size() > 0) {
                return query.where(cb.or(predicateListOr.toArray(new Predicate[predicateListOr.size()])))
                        .getRestriction();
            }
            return query.getRestriction();
        };
        Pageable pageable = PageRequestUtil.toPageable(listRequest, Sort.Direction.DESC, "createdTime");
        Page<WebHookSettings> all = webHookSettingsRepository.findAll(resultSpec, pageable);
        return all.map(entity -> WebHookMapper.INSTANCE.entityToItemResponse(entity));
    }

    private void checkName(String name) {
        Optional<WebHookSettings> webHookSettings = webHookSettingsRepository.findByName(name);
        if (webHookSettings.isPresent()) {
            throw new ResourceConflictException(ResourceType.PROJECT);
        }
    }

    private void checkUrl(String url) {
        try {
            new URL(url);
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("WebHook URL is illegal");
        }
    }

}
