package io.featureprobe.api.mapper;

import io.featureprobe.api.base.enums.EventTypeEnum;
import io.featureprobe.api.base.enums.MatcherTypeEnum;
import io.featureprobe.api.dao.entity.Event;
import io.featureprobe.api.dao.entity.Metric;
import io.featureprobe.api.dto.EventResponse;
import io.featureprobe.api.dto.MetricConfigResponse;
import io.featureprobe.api.dto.MetricCreateRequest;
import io.featureprobe.api.dto.MetricResponse;
import org.apache.commons.collections4.CollectionUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Mapper
public interface MetricMapper {

    MetricMapper INSTANCE = Mappers.getMapper(MetricMapper.class);

    @Mapping(target = "events", expression = "java(toEventResponses(metric.getEvents()))")
    MetricResponse entityToResponse(Metric metric);

    @Mapping(target = "eventName", expression = "java(toEventName(metric))")
    @Mapping(target = "eventType", expression = "java(toEventType(metric))")
    @Mapping(target = "metricType", source = "type")
    @Mapping(target = "matcher", expression = "java(toEventMatcher(metric))")
    @Mapping(target = "url", expression = "java(toEventUrl(metric))")
    @Mapping(target = "selector", expression = "java(toEventSelector(metric))")
    MetricConfigResponse entityToConfigResponse(Metric metric);

    @Mapping(target = "events", expression = "java(toEmptyEvents())")
    @Mapping(target = "type", source = "metricType")
    void mapEntity(MetricCreateRequest createRequest, @MappingTarget Metric metric);

    default Set<EventResponse> toEventResponses(Set<Event> events) {
        return events.stream().map(e -> EventMapper.INSTANCE.entityToResponse(e)).collect(Collectors.toSet());
    }

    default Set<Event> toEmptyEvents() {
        return new TreeSet<>();
    }

    default String toEventName(Metric metric) {
        if (CollectionUtils.isEmpty(metric.getEvents())) {
            return null;
        }
        String eventName = "";
        for(Iterator<Event> e=metric.getEvents().iterator(); e.hasNext();) {
            Event event = e.next();
            if (EventTypeEnum.CLICK.equals(event.getType())) {
                return event.getName();
            } else {
                eventName = event.getName();
            }
        }
        return eventName;
    }

    default EventTypeEnum toEventType(Metric metric) {
        if (CollectionUtils.isEmpty(metric.getEvents())) {
            return null;
        }
        EventTypeEnum eventType = EventTypeEnum.CUSTOM;
        for(Iterator<Event> e=metric.getEvents().iterator(); e.hasNext();) {
            Event event = e.next();
            if (EventTypeEnum.CLICK.equals(event.getType())) {
                return event.getType();
            } else {
                eventType = event.getType();
            }
        }
        return eventType;
    }

    default MatcherTypeEnum toEventMatcher(Metric metric) {
        if (CollectionUtils.isEmpty(metric.getEvents())) {
            return null;
        }
        return metric.getEvents().iterator().next().getMatcher();
    }

    default String toEventUrl(Metric metric) {
        if (CollectionUtils.isEmpty(metric.getEvents())) {
            return null;
        }
        return metric.getEvents().iterator().next().getUrl();
    }

    default String toEventSelector(Metric metric) {
        if (CollectionUtils.isEmpty(metric.getEvents())) {
            return null;
        }
        for(Iterator<Event> e=metric.getEvents().iterator(); e.hasNext();)
        {
            Event event = e.next();
            if (EventTypeEnum.CLICK.equals(event.getType())) {
                return event.getSelector();
            }
        }
        return null;
    }
}
