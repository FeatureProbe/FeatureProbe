package io.featureprobe.api.dao.repository;

import io.featureprobe.api.dao.entity.PublishMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PublishMessageRepository extends JpaRepository<PublishMessage, Long>,
        JpaSpecificationExecutor<PublishMessage> {

    List<PublishMessage> findAllByIdGreaterThanOrderByIdAsc(long id);

    Optional<PublishMessage> findOneById(Long id);

    /**
     * Provide this method as an alternative to findById(), as the findById()
     * method provided by JpaRepository can render the @Filter ineffective
     * @param id
     * @return
     */
    default Optional<PublishMessage> findById(Long id) {
        return findOneById(id);
    }

}
