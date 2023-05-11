package io.featureprobe.api.mapper;

import io.featureprobe.api.base.model.SegmentRuleModel;
import io.featureprobe.api.base.util.JsonMapper;
import io.featureprobe.api.dao.entity.SegmentVersion;
import io.featureprobe.api.dto.SegmentVersionResponse;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.List;

@Mapper
public interface SegmentVersionMapper extends BaseMapper {

    SegmentVersionMapper INSTANCE = Mappers.getMapper(SegmentVersionMapper.class);

    @Mapping(target = "rules", expression = "java(toSegmentRules(segmentVersion.getRules()))")
    SegmentVersionResponse entityToResponse(SegmentVersion segmentVersion);

    default List<SegmentRuleModel> toSegmentRules(String rules) {
        if (StringUtils.isNotBlank(rules)) {
            return JsonMapper.toObject(rules, List.class);
        }
        return toDefaultSegmentRules();
    }

    default List<SegmentRuleModel> toDefaultSegmentRules() {
        return Collections.emptyList();
    }

}
