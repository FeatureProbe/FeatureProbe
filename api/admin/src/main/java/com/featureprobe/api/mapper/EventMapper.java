package com.featureprobe.api.mapper;

import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dto.EventResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface EventMapper {

    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    EventResponse entityToResponse(Event event);

}
