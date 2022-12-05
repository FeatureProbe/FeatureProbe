package com.featureprobe.api.mapper;

import com.featureprobe.api.base.model.TargetingContent;
import com.featureprobe.api.dto.TargetingVersionResponse;
import com.featureprobe.api.dao.entity.TargetingVersion;
import com.featureprobe.api.base.util.JsonMapper;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TargetingVersionMapper extends BaseMapper {

    TargetingVersionMapper INSTANCE = Mappers.getMapper(TargetingVersionMapper.class);

    @Mapping(target = "content",
            expression = "java(toTargetingContent(targetingVersion.getContent()))")
    @Mapping(target = "createdBy", expression = "java(getAccount(targetingVersion.getCreatedBy()))")
    TargetingVersionResponse entityToResponse(TargetingVersion targetingVersion);

    default TargetingContent toTargetingContent(String content) {
        if (StringUtils.isNotBlank(content)) {
            return JsonMapper.toObject(content, TargetingContent.class);
        }
        return null;
    }

}
