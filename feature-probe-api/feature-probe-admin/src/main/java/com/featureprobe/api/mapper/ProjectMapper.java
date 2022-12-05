package com.featureprobe.api.mapper;

import com.featureprobe.api.dto.EnvironmentResponse;
import com.featureprobe.api.dto.ProjectCreateRequest;
import com.featureprobe.api.dto.ProjectResponse;
import com.featureprobe.api.dto.ProjectUpdateRequest;
import com.featureprobe.api.dao.entity.Environment;
import com.featureprobe.api.dao.entity.Project;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.util.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper
public interface ProjectMapper {

    ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class);

    @Mapping(target = "environments", expression = "java(toEnvironmentResponses(project.getEnvironments()))")
    ProjectResponse entityToResponse(Project project);

    Project requestToEntity(ProjectCreateRequest createRequest);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mapEntity(ProjectUpdateRequest updateRequest, @MappingTarget Project project);

    default List<EnvironmentResponse> toEnvironmentResponses(List<Environment> environments) {
        if (!CollectionUtils.isEmpty(environments)) {
            return environments.stream().map(environment ->
                    EnvironmentMapper.INSTANCE.entityToResponse(environment)).collect(Collectors.toList());
        }
        return Collections.emptyList();
    }

}
