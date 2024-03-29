package io.featureprobe.api.mapper;

import io.featureprobe.api.dto.MemberItemResponse;
import io.featureprobe.api.dto.MemberResponse;
import io.featureprobe.api.dto.MemberUpdateRequest;
import io.featureprobe.api.dao.entity.Member;
import org.apache.commons.lang3.StringUtils;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.factory.Mappers;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Mapper
public interface MemberMapper extends BaseMapper {

    MemberMapper INSTANCE = Mappers.getMapper(MemberMapper.class);

    @Mapping(target = "account", expression = "java(member.getAccount())")
    @Mapping(target = "nickname", expression = "java(member.getNickname())")
    @Mapping(target = "createdBy", expression = "java(getAccount(member.getCreatedBy()))")
    @Mapping(target = "visitedTime", expression = "java(member.getVisitedTime())")
    MemberItemResponse entityToItemResponse(Member member);

    @Mapping(target = "account", expression = "java(member.getAccount())")
    @Mapping(target = "createdBy", expression = "java(getAccount(member.getCreatedBy()))")
    @Mapping(target = "modifiedBy", expression = "java(getAccount(member.getModifiedBy()))")
    MemberResponse entityToResponse(Member member);


    @Mapping(target = "password", expression = "java(toPasswordEncrypt(updateRequest.getPassword(), member))")
    @Mapping(target = "account", expression = "java(updateRequest.getAccount())")
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void mapEntity(MemberUpdateRequest updateRequest, @MappingTarget Member member);

    default String toPasswordEncrypt(String password, Member member) {
        if (StringUtils.isNotBlank(password)) {
            return new BCryptPasswordEncoder().encode(password);
        }
        return member.getPassword();
    }
}
