package io.featureprobe.api.mapper;

import io.featureprobe.api.base.model.TargetingContent;
import io.featureprobe.api.dto.TargetingPublishRequest;
import io.featureprobe.api.dto.TargetingResponse;
import io.featureprobe.api.dao.entity.Targeting;
import io.featureprobe.api.base.util.JsonMapper;
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

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mapContentEntity(TargetingContent content, @MappingTarget TargetingContent currentContent);

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
