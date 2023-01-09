package com.featureprobe.api.mapper;

import com.featureprobe.api.base.model.TargetingContent;
import com.featureprobe.api.dto.TargetingPublishRequest;
import com.featureprobe.api.dto.TargetingResponse;
import com.featureprobe.api.dao.entity.Targeting;
import com.featureprobe.api.base.util.JsonMapper;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.Objects;

@Mapper
public interface TargetingMapper extends BaseMapper {

    TargetingMapper INSTANCE = Mappers.getMapper(TargetingMapper.class);

    @Mapping(target = "content",
            expression = "java(toTargetingContent(targeting.getContent()))")
    @Mapping(target = "modifiedBy",
            expression = "java(getAccount(targeting.getModifiedBy()))")
    TargetingResponse entityToResponse(Targeting targeting);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "content",
            expression = "java(toTargetingContentString(publishRequest.getContent(), targeting))")
    void mapEntity(TargetingPublishRequest publishRequest, @MappingTarget Targeting targeting);

    default String toTargetingContentString(TargetingContent content, Targeting targeting) {
        if (Objects.nonNull(content)) {
            return JsonMapper.toJSONString(content);
        }
        return targeting.getContent();
    }

    default TargetingContent toTargetingContent(String content) {
        if (StringUtils.isNotBlank(content)) {
            return JsonMapper.toObject(content, TargetingContent.class);
        }
        return null;
    }
}
