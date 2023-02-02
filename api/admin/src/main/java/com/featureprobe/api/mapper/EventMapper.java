package com.featureprobe.api.mapper;

import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dto.EventCreateRequest;
import com.featureprobe.api.dto.EventResponse;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper
public interface EventMapper {

    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Event requestToEntity(EventCreateRequest createRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    void mapEntity(EventCreateRequest createRequest, @MappingTarget Event event);

    EventResponse entityToResponse(Event event);
}
