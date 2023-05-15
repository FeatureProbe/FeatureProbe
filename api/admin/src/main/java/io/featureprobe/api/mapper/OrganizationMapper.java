package io.featureprobe.api.mapper;

import io.featureprobe.api.dao.entity.Organization;
import io.featureprobe.api.dto.OrganizationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface OrganizationMapper extends BaseMapper {

    OrganizationMapper INSTANCE = Mappers.getMapper(OrganizationMapper.class);

    OrganizationResponse entityToResponse(Organization organization);
}
