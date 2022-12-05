package com.featureprobe.api.mapper;

import com.featureprobe.api.dao.entity.Member;

public interface BaseMapper {


    default String getAccount(Member member) {
        if (member == null) {
            return "unknown";
        }
        return member.getAccount();
    }

}
