package com.featureprobe.api.mapper;

import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.api.dao.entity.DebugEvent;
import com.featureprobe.api.dao.entity.Event;
import com.featureprobe.api.dto.DebugEventResponse;
import com.featureprobe.api.dto.EventResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Map;

@Mapper
public interface EventMapper {

    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    EventResponse entityToResponse(Event event);

    @Mapping(target = "userDetail", expression = "java(toMap(debugEvent.getUserDetail()))")
    DebugEventResponse debugEventToResponse(DebugEvent debugEvent);

    default Map toMap(String userDetail) {
        return JsonMapper.toObject(userDetail, Map.class);
    }


}
