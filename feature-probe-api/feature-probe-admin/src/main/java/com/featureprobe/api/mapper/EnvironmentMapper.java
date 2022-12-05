package com.featureprobe.api.mapper;

import com.featureprobe.api.dto.ApprovalSettings;
import com.featureprobe.api.dto.EnvironmentCreateRequest;
import com.featureprobe.api.dto.EnvironmentResponse;
import com.featureprobe.api.dto.EnvironmentUpdateRequest;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.base.util.JsonMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface EnvironmentMapper {

    EnvironmentMapper INSTANCE = Mappers.getMapper(EnvironmentMapper.class);

    EnvironmentResponse entityToResponse(Environment environment);

    Environment requestToEntity(EnvironmentCreateRequest createRequest);

    @Mapping(target = "environmentKey", source = "key")
    @Mapping(target = "environmentName", source = "name")
    @Mapping(target = "enable", source = "enableApproval")
    @Mapping(target = "reviewers", expression = "java(toReviewerList(environment.getReviewers()))")
    ApprovalSettings entityToApprovalSettings(Environment environment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mapEntity(EnvironmentUpdateRequest updateRequest, @MappingTarget Environment environment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "enableApproval", source = "enable")
    @Mapping(target = "reviewers", expression = "java(toReviewers(approvalSettings.getReviewers()))")
    void mapEntity(ApprovalSettings approvalSettings, @MappingTarget Environment environment);

    default List<String> toReviewerList(String reviewers) {
        return JsonMapper.toListObject(reviewers, String.class);
    }

    default String toReviewers(List<String> reviewers) {
        return JsonMapper.toJSONString(reviewers);
    }
}
