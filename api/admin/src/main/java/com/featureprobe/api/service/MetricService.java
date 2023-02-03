package com.featureprobe.api.service;

import com.featureprobe.api.base.enums.ChangeLogType;
import com.featureprobe.api.base.enums.MatcherTypeEnum;
import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dao.entity.Metric;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.EnvironmentRepository;
import com.featureprobe.api.dao.repository.EventRepository;
import com.featureprobe.api.dao.repository.MetricRepository;
import com.featureprobe.api.dto.MetricConfigResponse;
import com.featureprobe.api.dto.MetricCreateRequest;
import com.featureprobe.api.dto.MetricResponse;
import com.featureprobe.api.mapper.MetricMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.codehaus.plexus.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.TreeSet;

@Slf4j
@AllArgsConstructor
@Service
public class MetricService {
    private EventRepository eventRepository;

    private MetricRepository metricRepository;
    private EnvironmentRepository environmentRepository;
    private ChangeLogService changeLogService;

    @PersistenceContext
    public EntityManager entityManager;

    @Transactional(rollbackFor = Exception.class)
    public MetricResponse create(String projectKey, String environmentKey, String toggleKey,
                                 MetricCreateRequest request) {
        validate(request);
        Metric metric = metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey)
                .orElse(new Metric(request.getType(), projectKey, environmentKey, toggleKey, new TreeSet<>()));
        MetricMapper.INSTANCE.mapEntity(request, metric);
        if (MetricTypeEnum.CLICK.equals(request.getType())) {
            String clickUniqueName = generateClickUniqueName(request.getMatcher(), request.getUrl(),
                    request.getSelector());
            Event clickEvent = eventRepository.findByName(clickUniqueName)
                    .orElse(new Event(clickUniqueName, request.getMatcher(), request.getUrl(), request.getSelector()));
            metric.getEvents().add(eventRepository.save(clickEvent));
        }
        if (MetricTypeEnum.PAGE_VIEW.equals(request.getType()) || MetricTypeEnum.CLICK.equals(request.getType())) {
            String pvUniqueName = generatePVUniqueName(request.getMatcher(), request.getUrl());
            Event pvEvent = eventRepository.findByName(pvUniqueName).
                    orElse(new Event(pvUniqueName, request.getMatcher(), request.getUrl()));
            metric.getEvents().add(eventRepository.save(pvEvent));
        } else {
            Event customEvent = eventRepository.findByName(request.getName()).
                    orElse(new Event(request.getName(), request.getMatcher(), request.getUrl()));
            metric.getEvents().add(eventRepository.save(customEvent));
        }
        Environment environment = environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey)
                .orElseThrow(() ->
                        new ResourceNotFoundException(ResourceType.ENVIRONMENT, projectKey + "-" + environmentKey));
        changeLogService.create(environment, ChangeLogType.CHANGE);
        Metric savedMetric = metricRepository.save(metric);
        return MetricMapper.INSTANCE.entityToResponse(savedMetric);
    }

    public MetricConfigResponse query(String projectKey, String environmentKey, String toggleKey) {
        Metric metric = metricRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.METRIC, projectKey + "-"
                        + environmentKey + "-" + toggleKey));
        return MetricMapper.INSTANCE.entityToConfigResponse(metric);
    }

    public static String generatePVUniqueName(MatcherTypeEnum matcher, String url) {
        String encodeStr = matcher.name() + url;
        return DigestUtils.md2Hex(encodeStr.getBytes(StandardCharsets.UTF_8));
    }

    private static String generateClickUniqueName(MatcherTypeEnum matcher, String url, String selector) {
        String encodeStr = matcher.name() + url + selector;
        return DigestUtils.md2Hex(encodeStr.getBytes(StandardCharsets.UTF_8));
    }


    private void validate(MetricCreateRequest request) {

        if (!(MetricTypeEnum.PAGE_VIEW.equals(request.getType()) || MetricTypeEnum.CLICK.equals(request.getType()))) {
            if (StringUtils.isBlank(request.getName())) {
                throw new IllegalArgumentException("validate.event_name_required");
            }
        }

        if (MetricTypeEnum.PAGE_VIEW.equals(request.getType()) ||
                MetricTypeEnum.CLICK.equals(request.getType())) {
            if (request.getMatcher() == null || StringUtils.isBlank(request.getUrl())) {
                throw new IllegalArgumentException("validate.event_url_required");
            }
        }

        if (MetricTypeEnum.CLICK.equals(request.getType())) {
            if (request.getMatcher() == null || StringUtils.isBlank(request.getUrl()) ||
                    StringUtils.isBlank(request.getSelector())) {
                throw new IllegalArgumentException("validate.event_selector_required");
            }
        }

    }
}
