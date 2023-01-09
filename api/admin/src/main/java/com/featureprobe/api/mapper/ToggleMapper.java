package com.featureprobe.api.mapper;


import com.featureprobe.api.base.model.Variation;
import com.featureprobe.api.dto.ToggleCreateRequest;
import com.featureprobe.api.dto.ToggleItemResponse;
import com.featureprobe.api.dto.ToggleResponse;
import com.featureprobe.api.dto.ToggleUpdateRequest;
import com.featureprobe.api.dao.entity.Tag;
import com.featureprobe.api.dao.entity.Toggle;
import com.featureprobe.api.base.util.JsonMapper;
import org.apache.commons.collections4.CollectionUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper
public interface ToggleMapper extends BaseMapper {

    ToggleMapper INSTANCE = Mappers.getMapper(ToggleMapper.class);

    @Mapping(target = "modifiedBy", expression = "java(getAccount(toggle.getModifiedBy()))")
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "useDays", expression = "java(getUseDays(toggle, deadline))")
    ToggleItemResponse entityToItemResponse(Toggle toggle, Long deadline);

    @Mapping(target = "variations", expression = "java(toVariation(toggle.getVariations()))")
    @Mapping(target = "tags", expression = "java(toTagNames(toggle.getTags()))")
    @Mapping(target = "modifiedBy", expression = "java(getAccount(toggle.getModifiedBy()))")
    @Mapping(target = "useDays", expression = "java(getUseDays(toggle, deadline))")
    ToggleResponse entityToResponse(Toggle toggle, Long deadline);

    default Long getUseDays(Toggle toggle, Long deadline) {
        long days = (long) Math.floor((System.currentTimeMillis() - toggle.getCreatedTime().getTime()) /
                (1000 * 60 * 60 * 24));
        return !toggle.isPermanent() && days > deadline ? days : null;
    }

    default Set<String> toTagNames(Set<Tag> tags) {
        if (CollectionUtils.isEmpty(tags)) {
            return Collections.emptySet();
        }
        return tags.stream().map(Tag::getName).collect(Collectors.toSet());
    }

    default List<Variation> toVariation(String variation) {
        return JsonMapper.toListObject(variation, Variation.class);
    }

    @Mapping(target = "variations", expression = "java(toVariationJson(toggleRequest.getVariations()))")
    @Mapping(target = "tags", ignore = true)
    Toggle requestToEntity(ToggleCreateRequest toggleRequest);

    default String toVariationJson(List<Variation> variations) {
        return JsonMapper.toJSONString(variations);
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "tags", ignore = true)
    void mapEntity(ToggleUpdateRequest toggleRequest, @MappingTarget Toggle toggle);

}
