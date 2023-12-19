package io.featureprobe.api.dao.repository;


import io.featureprobe.api.dao.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long>, JpaSpecificationExecutor<Member> {

    Optional<Member> findByAccount(String account);

    boolean existsByAccount(String account);

    Optional<Member> findOneById(Long id);

    /**
     * Provide this method as an alternative to findOneById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<Member> findById(Long id) {
        return findOneById(id);
    }

}
