package io.featureprobe.api.mapper;

import io.featureprobe.api.dao.entity.AccessToken;
import io.featureprobe.api.dto.AccessTokenCreateRequest;
import io.featureprobe.api.dto.AccessTokenResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AccessTokenMapper extends BaseMapper {

    AccessTokenMapper INSTANCE = Mappers.getMapper(AccessTokenMapper.class);

    AccessTokenResponse entityToResponse(AccessToken accessToken);

    AccessToken requestToEntity(AccessTokenCreateRequest request);
}
