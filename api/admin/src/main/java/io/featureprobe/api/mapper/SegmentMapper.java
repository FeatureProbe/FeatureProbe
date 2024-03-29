package io.featureprobe.api.mapper;

import io.featureprobe.api.dto.SegmentCreateRequest;
import io.featureprobe.api.dto.SegmentPublishRequest;
import io.featureprobe.api.dto.SegmentResponse;
import io.featureprobe.api.dto.SegmentUpdateRequest;
import io.featureprobe.api.dto.ToggleSegmentResponse;
import io.featureprobe.api.dao.entity.Segment;
import io.featureprobe.api.dao.entity.Toggle;
import io.featureprobe.api.base.model.SegmentRuleModel;
import io.featureprobe.api.base.util.JsonMapper;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;

@Mapper
public interface SegmentMapper extends BaseMapper {

    SegmentMapper INSTANCE = Mappers.getMapper(SegmentMapper.class);

    Segment requestToEntity(SegmentCreateRequest createRequest);

    @Mapping(target = "rules", expression = "java(toSegmentRules(segment.getRules()))")
    @Mapping(target = "modifiedBy", expression = "java(getAccount(segment.getModifiedBy()))")
    SegmentResponse entityToResponse(Segment segment);

    ToggleSegmentResponse toggleToToggleSegment(Toggle toggle);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mapEntity(SegmentUpdateRequest updateRequest, @MappingTarget Segment segment);

    @Mapping(target = "rules", expression = "java(toSegmentRulesString(publishRequest.getRules()))")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mapEntity(SegmentPublishRequest publishRequest, @MappingTarget Segment segment);

    default String toSegmentRulesString(List<SegmentRuleModel> rules) {
        if (!CollectionUtils.isEmpty(rules)) {
            return JsonMapper.toJSONString(rules);
        }
        return toDefaultSegmentRulesString();
    }

    default List<SegmentRuleModel> toSegmentRules(String rules) {
        if (StringUtils.isNotBlank(rules)) {
            return JsonMapper.toObject(rules, List.class);
        }
        return toDefaultSegmentRules();
    }

    default String toDefaultSegmentRulesString() {
        return JsonMapper.toJSONString(Collections.emptyList());
    }

    default List<SegmentRuleModel> toDefaultSegmentRules() {
        return Collections.emptyList();
    }

}
