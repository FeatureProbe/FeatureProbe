package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.OrganizationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember, Long>,
        JpaSpecificationExecutor<OrganizationMember> {

    Optional<OrganizationMember> findByOrganizationIdAndMemberId(Long organizationId, Long memberId);

}
