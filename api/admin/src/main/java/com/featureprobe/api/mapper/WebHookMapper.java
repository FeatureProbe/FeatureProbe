package com.featureprobe.api.mapper;

import com.featureprobe.api.dao.entity.WebHookSettings;
import com.featureprobe.api.dto.WebHookCreateRequest;
import com.featureprobe.api.dto.WebHookItemResponse;
import com.featureprobe.api.dto.WebHookResponse;
import com.featureprobe.api.dto.WebHookUpdateRequest;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

@Mapper
public interface WebHookMapper extends BaseMapper {

    WebHookMapper INSTANCE = Mappers.getMapper(WebHookMapper.class);

    WebHookSettings requestToEntity(WebHookCreateRequest createRequest);

    @Mapping(target = "modifiedBy", expression = "java(getAccount(webHookSettings.getModifiedBy()))")
    @Mapping(target = "createdBy", expression = "java(getAccount(webHookSettings.getCreatedBy()))")
    WebHookResponse entityToResponse(WebHookSettings webHookSettings);

    @Mapping(target = "modifiedBy", expression = "java(getAccount(webHookSettings.getModifiedBy()))")
    @Mapping(target = "createdBy", expression = "java(getAccount(webHookSettings.getCreatedBy()))")
    WebHookItemResponse entityToItemResponse(WebHookSettings webHookSettings);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mapEntity(WebHookUpdateRequest updateRequest, @MappingTarget WebHookSettings hookSettings);

}
