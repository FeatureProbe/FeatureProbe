package io.featureprobe.api.mapper;

import io.featureprobe.api.dto.AttributeResponse;
import io.featureprobe.api.dao.entity.Attribute;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AttributeMapper {

    AttributeMapper INSTANCE = Mappers.getMapper(AttributeMapper.class);

    AttributeResponse entityToResponse(Attribute attribute);

}
