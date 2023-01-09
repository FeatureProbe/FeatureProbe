package com.featureprobe.api.service

import com.featureprobe.api.dto.TagRequest
import com.featureprobe.api.dao.entity.Tag
import com.featureprobe.api.dao.repository.TagRepository
import org.hibernate.internal.SessionImpl
import spock.lang.Specification

import javax.persistence.EntityManager

class TagServiceSpec extends Specification {

    TagService tagService
    TagRepository tagRepository
    EntityManager entityManager

    def setup() {
        tagRepository = Mock(TagRepository)
        entityManager = Mock(SessionImpl)
        tagService = new TagService(tagRepository, entityManager)
    }

    def "create tag success"() {
        def tagName = "tag1", projectKey = "pj1"
        Tag savedTagEntity

        when:
        def tagResponse = tagService.create(projectKey, new TagRequest(tagName))

        then:
        1 * tagRepository.save(_ as Tag) >> { it -> savedTagEntity = it[0] }
        with(savedTagEntity) {
            tagName == name
            projectKey == projectKey
            !deleted
        }
        tagName == tagResponse.name
    }

    def "query tags by project key"() {
        def projectKey = "pj1"

        when:
        def tagResponses = tagService.queryByProjectKey(projectKey)

        then:

        1 * tagRepository.findByProjectKey(projectKey) >> [new Tag(name: "tag1", projectKey: projectKey),
                                                           new Tag(name: "tag2", projectKey: projectKey)]
        2 == tagResponses.size()
        "tag1" == tagResponses.get(0).name
        "tag2" == tagResponses.get(1).name
    }


}
