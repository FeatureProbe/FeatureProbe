package com.featureprobe.api.mapper;

import com.featureprobe.api.base.model.HookContext;

import com.featureprobe.api.hook.CallbackRequestBody;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface HookContextMapper {

    HookContextMapper INSTANCE = Mappers.getMapper(HookContextMapper.class);

    @Mapping(target = "data", source = "response")
    CallbackRequestBody contextToRequestBody(HookContext hookContext);


}
