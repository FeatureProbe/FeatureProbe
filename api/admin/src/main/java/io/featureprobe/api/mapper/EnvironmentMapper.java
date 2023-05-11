package io.featureprobe.api.mapper;

import io.featureprobe.api.dto.ApprovalSettings;
import io.featureprobe.api.dto.ApprovalSettingsResponse;
import io.featureprobe.api.dto.EnvironmentCreateRequest;
import io.featureprobe.api.dto.EnvironmentResponse;
import io.featureprobe.api.dto.EnvironmentUpdateRequest;
import io.featureprobe.api.dao.entity.Environment;
import io.featureprobe.api.base.util.JsonMapper;
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
    ApprovalSettingsResponse entityToApprovalSettingsResponse(Environment environment);

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
