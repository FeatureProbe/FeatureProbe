package com.featureprobe.api.validate


import com.featureprobe.api.base.enums.ResourceType
import com.featureprobe.api.dao.exception.ResourceNotFoundException
import com.featureprobe.api.dao.repository.EnvironmentRepository
import com.featureprobe.api.dao.repository.ProjectRepository
import com.featureprobe.api.dao.repository.SegmentRepository
import com.featureprobe.api.dao.repository.ToggleRepository
import spock.lang.Specification

class ResourceExistsValidateAspectSpec extends Specification {

    ProjectRepository projectRepository
    EnvironmentRepository environmentRepository
    ToggleRepository toggleRepository
    SegmentRepository segmentRepository

    ResourceExistsValidateAspect resourceExistsValidateAspect
    def projectKey = "prj_test_key"
    def toggleKey = "toggle_key_test"
    def envKey = "env_key_test"
    def segmentKey = "segment_test_key"

    def setup() {
        projectRepository = Mock(ProjectRepository)
        environmentRepository = Mock(EnvironmentRepository)
        toggleRepository = Mock(ToggleRepository)
        segmentRepository = Mock(SegmentRepository)
        resourceExistsValidateAspect = new ResourceExistsValidateAspect(projectRepository, toggleRepository,
                environmentRepository, segmentRepository)
    }


    def "validate project exists"() {
        given:
        projectRepository.existsByKey(projectKey) >> true

        when:
        resourceExistsValidateAspect.validateProjectExists(new ResourceKey(ResourceType.PROJECT, projectKey))

        then:
        noExceptionThrown()
    }

    def "validate project not exists"() {
        given:
        projectRepository.existsByKey(projectKey) >> false

        when:
        resourceExistsValidateAspect.validateProjectExists(new ResourceKey(ResourceType.PROJECT, projectKey))

        then:
        thrown(ResourceNotFoundException)
    }

    def "validate toggle exists"() {
        given:
        toggleRepository.existsByProjectKeyAndKey(projectKey, toggleKey) >> true

        when:
        resourceExistsValidateAspect.validateToggleExists(new ResourceKey(ResourceType.PROJECT, projectKey),
                [new ResourceKey(ResourceType.TOGGLE, toggleKey)])

        then:
        noExceptionThrown()
    }

    def "validate toggle not exists"() {
        given:
        toggleRepository.existsByProjectKeyAndKey(projectKey, toggleKey) >> false

        when:
        resourceExistsValidateAspect.validateToggleExists(new ResourceKey(ResourceType.PROJECT, projectKey),
                [new ResourceKey(ResourceType.TOGGLE, toggleKey)])

        then:
        thrown(ResourceNotFoundException)
    }

    def "validate segment exists"() {
        given:
        segmentRepository.existsByProjectKeyAndKey(projectKey, segmentKey) >> true

        when:
        resourceExistsValidateAspect.validateSegmentExists(new ResourceKey(ResourceType.PROJECT, projectKey),
                [new ResourceKey(ResourceType.SEGMENT, segmentKey)])

        then:
        noExceptionThrown()
    }

    def "validate segment not exists"() {
        given:
        segmentRepository.existsByProjectKeyAndKey(projectKey, segmentKey) >> false

        when:
        resourceExistsValidateAspect.validateSegmentExists(new ResourceKey(ResourceType.PROJECT, projectKey),
                [new ResourceKey(ResourceType.SEGMENT, segmentKey)])

        then:
        thrown(ResourceNotFoundException)
    }

    def "validate environment exists"() {
        given:
        environmentRepository.existsByProjectKeyAndKey(projectKey, envKey) >> true

        when:
        resourceExistsValidateAspect.validateEnvironmentExists(new ResourceKey(ResourceType.PROJECT, projectKey),
                [new ResourceKey(ResourceType.ENVIRONMENT, envKey)])

        then:
        noExceptionThrown()
    }

    def "validate environment not exists"() {
        given:
        environmentRepository.existsByProjectKeyAndKey(projectKey, envKey) >> false

        when:
        resourceExistsValidateAspect.validateEnvironmentExists(new ResourceKey(ResourceType.PROJECT, projectKey),
                [new ResourceKey(ResourceType.ENVIRONMENT, envKey)])

        then:
        thrown(ResourceNotFoundException)
    }

}
