package com.featureprobe.api.mapper;

import com.featureprobe.api.dto.AttributeResponse;
import com.featureprobe.api.dao.entity.Attribute;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AttributeMapper {

    AttributeMapper INSTANCE = Mappers.getMapper(AttributeMapper.class);

    AttributeResponse entityToResponse(Attribute attribute);

}
