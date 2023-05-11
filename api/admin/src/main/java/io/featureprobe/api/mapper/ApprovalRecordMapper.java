package io.featureprobe.api.mapper;

import io.featureprobe.api.dto.ApprovalRecordResponse;
import io.featureprobe.api.dao.entity.ApprovalRecord;
import io.featureprobe.api.dto.ApprovalResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ApprovalRecordMapper extends BaseMapper {

    ApprovalRecordMapper INSTANCE = Mappers.getMapper(ApprovalRecordMapper.class);

    @Mapping(target = "reviewers", ignore = true)
    ApprovalRecordResponse entityToResponse(ApprovalRecord approvalRecord);

    @Mapping(target = "approvalDate", source = "modifiedTime")
    ApprovalResponse entityToApprovalResponse(ApprovalRecord approvalRecord);
}
