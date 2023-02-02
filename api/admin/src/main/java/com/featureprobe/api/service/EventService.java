package com.featureprobe.api.service;

import com.featureprobe.api.base.enums.EventTypeEnum;
import com.featureprobe.api.base.enums.ResourceType;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dao.entity.TargetingEvent;
import com.featureprobe.api.dao.exception.ResourceNotFoundException;
import com.featureprobe.api.dao.repository.EventRepository;
import com.featureprobe.api.dao.repository.TargetingEventRepository;
import com.featureprobe.api.dto.EventCreateRequest;
import com.featureprobe.api.dto.EventResponse;
import com.featureprobe.api.mapper.EventMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.codehaus.plexus.util.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@AllArgsConstructor
@Service
public class EventService {

    private EventRepository eventRepository;

    private TargetingEventRepository targetingEventRepository;

    @PersistenceContext
    public EntityManager entityManager;

    @Transactional(rollbackFor = Exception.class)
    public EventResponse create(String projectKey, String environmentKey, String toggleKey,
                                EventCreateRequest request) {
        validate(request);
        if (EventTypeEnum.PAGE_VIEW.equals(request.getType()) ||
                EventTypeEnum.CLICK.equals(request.getType())) {
            request.setName(generateUniqueName(request));
        }
        targetingEventRepository.deleteByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey);
        Optional<Event> eventOptional = eventRepository.findByName(request.getName());
        Event savedEvent;
        if (eventOptional.isPresent()) {
            savedEvent = eventOptional.get();
        } else {
            savedEvent = eventRepository.save(EventMapper.INSTANCE.requestToEntity(request));
        }
        saveTargetingEvent(projectKey, environmentKey, toggleKey, savedEvent);
        return EventMapper.INSTANCE.entityToResponse(savedEvent);
    }

    public EventResponse query(String projectKey, String environmentKey, String toggleKey) {
        TargetingEvent targetingEvent = targetingEventRepository
                .findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey)
                .orElseThrow(() -> new ResourceNotFoundException(ResourceType.EVENT, projectKey + "-"
                        + environmentKey + "-" + toggleKey));
        return EventMapper.INSTANCE.entityToResponse(targetingEvent.getEvent());
    }

    private TargetingEvent saveTargetingEvent(String projectKey, String environmentKey, String toggleKey,
                                              Event event) {
        TargetingEvent targetingEvent = new TargetingEvent();
        targetingEvent.setEvent(event);
        targetingEvent.setProjectKey(projectKey);
        targetingEvent.setEnvironmentKey(environmentKey);
        targetingEvent.setToggleKey(toggleKey);
        return targetingEventRepository.save(targetingEvent);
    }

    private String generateUniqueName(EventCreateRequest request) {
        String encodeStr = "";
        if (EventTypeEnum.PAGE_VIEW.equals(request.getType())) {
            encodeStr = request.getType().name() + request.getMatcher().name() + request.getUrl();
        } else if (EventTypeEnum.CLICK.equals(request.getType())) {
            encodeStr = request.getType().name() + request.getMatcher().name() + request.getUrl() +
                    request.getSelector();
        }
        return DigestUtils.md2Hex(encodeStr.getBytes(StandardCharsets.UTF_8));
    }

    private void validate(EventCreateRequest request) {

        if (EventTypeEnum.CUSTOM.equals(request.getType())) {
            if (StringUtils.isBlank(request.getName()) || Objects.isNull(request.getMetric())) {
                throw new IllegalArgumentException("validate.event_name_required");
            }
        }

        if (EventTypeEnum.PAGE_VIEW.equals(request.getType()) ||
                EventTypeEnum.CLICK.equals(request.getType())) {
            if (request.getMatcher() == null || StringUtils.isBlank(request.getUrl())) {
                throw new IllegalArgumentException("validate.event_url_required");
            }
        }

        if (EventTypeEnum.CLICK.equals(request.getType())) {
            if (request.getMatcher() == null || StringUtils.isBlank(request.getUrl()) ||
                    StringUtils.isBlank(request.getSelector())) {
                throw new IllegalArgumentException("validate.event_selector_required");
            }
        }

    }
}
