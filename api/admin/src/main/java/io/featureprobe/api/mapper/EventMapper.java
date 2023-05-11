package io.featureprobe.api.mapper;

import io.featureprobe.api.base.util.JsonMapper;
import io.featureprobe.api.dao.entity.DebugEvent;
import io.featureprobe.api.dao.entity.Event;
import io.featureprobe.api.dto.DebugEventResponse;
import io.featureprobe.api.dto.EventResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

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
