package com.featureprobe.api.dao.repository;


import com.featureprobe.api.base.enums.AccessTokenType;
import com.featureprobe.api.dao.entity.AccessToken;
import com.featureprobe.api.dao.entity.ApprovalRecord;
import org.springdoc.core.converters.models.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long>, JpaSpecificationExecutor<AccessToken> {

    boolean existsByNameAndType(String name, AccessTokenType type);

    Optional<AccessToken> findByToken(String token);
}