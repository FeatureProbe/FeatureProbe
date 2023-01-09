package com.featureprobe.api.mapper;

import com.featureprobe.api.dto.DictionaryResponse;
import com.featureprobe.api.dao.entity.Dictionary;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DictionaryMapper {

    DictionaryMapper INSTANCE = Mappers.getMapper(DictionaryMapper.class);

    DictionaryResponse entityToResponse(Dictionary dictionary);
}
