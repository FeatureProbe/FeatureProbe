package com.featureprobe.api.dao.repository;

import com.featureprobe.api.dao.entity.PublishMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublishMessageRepository extends JpaRepository<PublishMessage, Long>,
        JpaSpecificationExecutor<PublishMessage> {

    List<PublishMessage> findAllByIdGreaterThanOrderByIdAsc(long id);

}
