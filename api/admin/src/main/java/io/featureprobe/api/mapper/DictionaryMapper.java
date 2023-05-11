package io.featureprobe.api.mapper;

import io.featureprobe.api.dto.DictionaryResponse;
import io.featureprobe.api.dao.entity.Dictionary;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DictionaryMapper {

    DictionaryMapper INSTANCE = Mappers.getMapper(DictionaryMapper.class);

    DictionaryResponse entityToResponse(Dictionary dictionary);
}
