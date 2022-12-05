package com.featureprobe.api.service

import com.featureprobe.api.base.hook.HookSettingsStatus
import com.featureprobe.api.dao.entity.WebHookSettings
import com.featureprobe.api.dao.exception.ResourceConflictException
import com.featureprobe.api.dao.repository.WebHookSettingsRepository
import com.featureprobe.api.dto.WebHookCreateRequest
import com.featureprobe.api.dto.WebHookListRequest
import com.featureprobe.api.dto.WebHookUpdateRequest
import org.hibernate.internal.SessionImpl
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import spock.lang.Specification

import javax.persistence.EntityManager

class WebHookServiceSpec extends Specification {

    WebHookService webHookService

    WebHookSettingsRepository webHookSettingsRepository

    EntityManager entityManager


    def setup() {
        webHookSettingsRepository = Mock(WebHookSettingsRepository)
        entityManager = Mock(SessionImpl)
        webHookService = new WebHookService(webHookSettingsRepository, entityManager)
    }

    def "create a webhook"() {
        given:
        WebHookCreateRequest createRequest = new WebHookCreateRequest(name: "Test WebHook", status: HookSettingsStatus.ENABLE,
                url: "http://127.0.0.1:8080/test", description: "This is a test WenHook")
        when:
        def create = webHookService.create(createRequest)
        then:
        1 * webHookSettingsRepository.findByName("Test WebHook") >> Optional.empty()
        1 * webHookSettingsRepository.save(_) >> new WebHookSettings(id: 1, name: "Demo WebHook",
                status: HookSettingsStatus.ENABLE, url: "http://127.0.0.1:8080/test", description: "This is a test WenHook")
        HookSettingsStatus.ENABLE == create.status
        "http://127.0.0.1:8080/test" == create.url
    }

    def "create a webhook fail by name exist"() {
        given:
        WebHookCreateRequest createRequest = new WebHookCreateRequest(name: "Test WebHook", status: HookSettingsStatus.ENABLE,
                url: "http://127.0.0.1:8080/test", description: "This is a test WenHook")
        when:
        webHookService.create(createRequest)
        then:
        1 * webHookSettingsRepository.findByName("Test WebHook") >> Optional.of(new WebHookSettings(name: "Test WebHook"))
        thrown(ResourceConflictException)
    }

    def "create a webhook fail by url illegal"() {
        given:
        WebHookCreateRequest createRequest = new WebHookCreateRequest(name: "Test WebHook", status: HookSettingsStatus.ENABLE,
                url: "test://127.0.0.1:8080/test", description: "This is a test WenHook")
        when:
        webHookService.create(createRequest)
        then:
        1 * webHookSettingsRepository.findByName("Test WebHook") >> Optional.empty()
        thrown(IllegalArgumentException)
    }

    def "update a webhook"() {
        given:
        WebHookUpdateRequest updateRequest = new WebHookUpdateRequest(name: "Test WebHook", status: HookSettingsStatus.ENABLE,
                url: "http://127.0.0.1:8080/test", description: "This is a test WenHook")
        when:
        def update = webHookService.update(1, updateRequest)
        then:
        1 * webHookSettingsRepository.findById(1) >> Optional.of(new WebHookSettings(id: 1, name: "Demo WebHook",
                status: HookSettingsStatus.DISABLE,  url: "http://127.0.0.1:8080/demo", description: "This is a demo WenHook"))
        1 * webHookSettingsRepository.findByName("Test WebHook") >> Optional.empty()
        1 * webHookSettingsRepository.save(_) >> new WebHookSettings(id: 1, name: "Test WebHook", status: HookSettingsStatus.ENABLE,
                url: "http://127.0.0.1:8080/test", description: "This is a test WenHook")
        HookSettingsStatus.ENABLE == update.status
        "Test WebHook" == update.name
        "http://127.0.0.1:8080/test" == update.url
    }

    def "update a webhook fail by name exist"() {
        given:
        WebHookUpdateRequest updateRequest = new WebHookUpdateRequest(name: "Test WebHook", status: HookSettingsStatus.ENABLE,
                url: "http://127.0.0.1:8080/test", description: "This is a test WenHook")
        when:
        def update = webHookService.update(1, updateRequest)
        then:
        1 * webHookSettingsRepository.findById(1) >> Optional.of(new WebHookSettings(id: 1, name: "Demo WebHook",
                status: HookSettingsStatus.DISABLE,  url: "http://127.0.0.1:8080/demo", description: "This is a demo WenHook"))
        1 * webHookSettingsRepository.findByName("Test WebHook") >> Optional.of(new WebHookSettings(name: "Test WebHook"))
        thrown(ResourceConflictException)
    }

    def "update a webhook fail by url illegal"() {
        given:
        WebHookUpdateRequest updateRequest = new WebHookUpdateRequest(name: "Test WebHook", status: HookSettingsStatus.ENABLE,
                url: "test://127.0.0.1:8080/test", description: "This is a test WenHook")
        when:
        def update = webHookService.update(1, updateRequest)
        then:
        1 * webHookSettingsRepository.findById(1) >> Optional.of(new WebHookSettings(id: 1, name: "Demo WebHook",
                status: HookSettingsStatus.DISABLE,  url: "http://127.0.0.1:8080/demo", description: "This is a demo WenHook"))
        1 * webHookSettingsRepository.findByName("Test WebHook") >> Optional.empty()
        thrown(IllegalArgumentException)
    }

    def "delete a webhook"() {
        when:
        def delete = webHookService.delete(1)
        then:
        1 * webHookSettingsRepository.findById(1) >> Optional.of(new WebHookSettings(id: 1, name: "Demo WebHook",
                status: HookSettingsStatus.DISABLE,  url: "http://127.0.0.1:8080/demo", description: "This is a demo WenHook"))
        1 * webHookSettingsRepository.deleteById(1)
    }

    def "query a webhook"(){
        when:
        def query = webHookService.query(1)
        then:
        1 * webHookSettingsRepository.findById(1) >> Optional.of(new WebHookSettings(id: 1, name: "Test WebHook",
                status: HookSettingsStatus.ENABLE,  url: "http://127.0.0.1:8080/test", description: "This is a demo WenHook"))
        HookSettingsStatus.ENABLE == query.status
        "Test WebHook" == query.name
        "http://127.0.0.1:8080/test" == query.url
    }

    def "query webhook list"() {
        given:
        WebHookListRequest listRequest = new WebHookListRequest(nameLike: "test", status: HookSettingsStatus.ENABLE)
        when:
        def list = webHookService.list(listRequest)
        then:
        1 *  webHookSettingsRepository.findAll(_, _) >> new PageImpl<>([new WebHookSettings(id: 1, name: "Test WebHook",
                status: HookSettingsStatus.ENABLE,  url: "http://127.0.0.1:8080/test", description: "This is a demo WenHook")],
                Pageable.ofSize(1), 1)
        1 == list.content.size()
    }
}

