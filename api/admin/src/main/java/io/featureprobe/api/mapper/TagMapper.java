package io.featureprobe.api.mapper;

import io.featureprobe.api.dto.TagRequest;
import io.featureprobe.api.dto.TagResponse;
import io.featureprobe.api.dao.entity.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TagMapper {
    TagMapper INSTANCE = Mappers.getMapper(TagMapper.class);

    TagResponse entityToResponse(Tag tag);

    Tag requestToEntity(TagRequest tagRequest);

}
