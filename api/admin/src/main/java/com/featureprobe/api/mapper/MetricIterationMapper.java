package com.featureprobe.api.mapper;

import com.featureprobe.api.dao.entity.MetricIteration;
import com.featureprobe.api.dto.MetricIterationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface MetricIterationMapper {

    MetricIterationMapper INSTANCE = Mappers.getMapper(MetricIterationMapper.class);

    MetricIterationResponse entityToResponse(MetricIteration iteration);

}
