package com.featureprobe.api.mapper;

import com.featureprobe.api.dto.TagRequest;
import com.featureprobe.api.dto.TagResponse;
import com.featureprobe.api.dao.entity.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TagMapper {
    TagMapper INSTANCE = Mappers.getMapper(TagMapper.class);

    TagResponse entityToResponse(Tag tag);

    Tag requestToEntity(TagRequest tagRequest);

}
