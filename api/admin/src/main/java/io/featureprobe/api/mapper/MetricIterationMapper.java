package io.featureprobe.api.mapper;

import io.featureprobe.api.dao.entity.MetricIteration;
import io.featureprobe.api.dto.MetricIterationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface MetricIterationMapper {

    MetricIterationMapper INSTANCE = Mappers.getMapper(MetricIterationMapper.class);

    MetricIterationResponse entityToResponse(MetricIteration iteration);

}
