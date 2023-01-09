package com.featureprobe.api.service

import com.featureprobe.api.dto.AttributeRequest
import com.featureprobe.api.dao.entity.Attribute
import com.featureprobe.api.dao.repository.AttributeRepository
import org.springframework.util.CollectionUtils
import spock.lang.Specification
import spock.lang.Title

@Title("Attribute Unit Test")
class AttributeServiceSpec extends Specification {

    AttributeService attributeService;

    AttributeRepository attributeRepository

    String projectKey

    String key

    def setup() {
        attributeRepository = Mock(AttributeRepository)
        attributeService = new AttributeService(attributeRepository)
        projectKey = "feature_probe"
        key = "unit_test_attribute"
    }

    def "attribute list"() {
        when:
        def attributes = attributeService.queryByProjectKey(projectKey)
        then:
        1 * attributeRepository.findByProjectKey(projectKey) >> [new Attribute(key: key)]
        with(attributes) {
            !CollectionUtils.isEmpty(it)
        }
    }

    def "created attribute"() {
        def AttributeRequest attributeRequest = createAttributeRequest()
        when:
        def ret = attributeService.create(projectKey, attributeRequest)
        then:
        1 * attributeRepository.save(_ as Attribute) >> new Attribute(key: key)
        with(ret) {
            key == it.getKey()
        }
    }

    def createAttributeRequest() {
        def request = new AttributeRequest()
        request.setKey(key)
        request
    }
}

