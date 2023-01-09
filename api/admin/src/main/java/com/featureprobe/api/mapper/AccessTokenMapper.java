package com.featureprobe.api.mapper;

import com.featureprobe.api.dao.entity.AccessToken;
import com.featureprobe.api.dto.AccessTokenCreateRequest;
import com.featureprobe.api.dto.AccessTokenResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AccessTokenMapper extends BaseMapper {

    AccessTokenMapper INSTANCE = Mappers.getMapper(AccessTokenMapper.class);

    AccessTokenResponse entityToResponse(AccessToken accessToken);

    AccessToken requestToEntity(AccessTokenCreateRequest request);
}
