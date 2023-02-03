package com.featureprobe.api.mapper;

import com.featureprobe.api.base.enums.MatcherTypeEnum;
import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dao.entity.Metric;
import com.featureprobe.api.dto.EventResponse;
import com.featureprobe.api.dto.MetricConfigResponse;
import com.featureprobe.api.dto.MetricCreateRequest;
import com.featureprobe.api.dto.MetricResponse;
import org.apache.commons.collections4.CollectionUtils;
import org.codehaus.plexus.util.StringUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.Iterator;
import java.util.Set;
import java.util.TreeSet;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Mapper
public interface MetricMapper {

    MetricMapper INSTANCE = Mappers.getMapper(MetricMapper.class);

    @Mapping(target = "events", expression = "java(toEventResponses(metric.getEvents()))")
    MetricResponse entityToResponse(Metric metric);

    @Mapping(target = "name", expression = "java(toEventName(metric))")
    @Mapping(target = "matcher", expression = "java(toEventMatcher(metric))")
    @Mapping(target = "url", expression = "java(toEventUrl(metric))")
    @Mapping(target = "selector", expression = "java(toEventSelector(metric))")
    MetricConfigResponse entityToConfigResponse(Metric metric);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "events", expression = "java(toEmptyEvents())")
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
        if (MetricTypeEnum.CLICK.equals(metric.getType())) {
            for(Iterator<Event> e=metric.getEvents().iterator(); e.hasNext();)
            {
                Event event = e.next();
                if (StringUtils.isNotBlank(event.getSelector())) {
                    return event.getName();
                }
            }
        }
        return metric.getEvents().iterator().next().getName();
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
        if (MetricTypeEnum.CLICK.equals(metric.getType())) {
            for(Iterator<Event> e=metric.getEvents().iterator(); e.hasNext();)
            {
                Event event = e.next();
                if (StringUtils.isNotBlank(event.getSelector())) {
                    return event.getSelector();
                }
            }
        }
        return metric.getEvents().iterator().next().getSelector();
    }
}
