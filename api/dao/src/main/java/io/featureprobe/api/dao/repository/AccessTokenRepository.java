package io.featureprobe.api.dao.repository;


import io.featureprobe.api.base.enums.AccessTokenType;
import io.featureprobe.api.dao.entity.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long>, JpaSpecificationExecutor<AccessToken> {

    boolean existsByNameAndType(String name, AccessTokenType type);

    Optional<AccessToken> findByToken(String token);

    Optional<AccessToken> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<AccessToken> findById(Long id) {
        return findOneById(id);
    }
}