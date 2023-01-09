package com.featureprobe.api.service;

import com.featureprobe.api.dao.entity.Member;
import com.featureprobe.api.dao.exception.ResourceConflictException;
import com.featureprobe.api.dao.repository.MemberRepository;
import com.featureprobe.api.base.db.IncludeDeleted;
import com.featureprobe.api.base.enums.ResourceType;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Optional;

@Service
@AllArgsConstructor
public class MemberIncludeDeletedService {

    private MemberRepository memberRepository;

    @PersistenceContext
    public EntityManager entityManager;

    @IncludeDeleted
    public boolean validateAccountIncludeDeleted(String account) {
        if (memberRepository.existsByAccount(account)) {
            throw new ResourceConflictException(ResourceType.MEMBER);
        }
        return true;
    }

    @IncludeDeleted
    public Optional<Member> queryMemberByAccountIncludeDeleted(String account) {
        return memberRepository.findByAccount(account);
    }

}
