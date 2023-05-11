package io.featureprobe.api.event


import io.featureprobe.api.event.listener.WebHookPostEventListener
import io.featureprobe.api.base.model.CallbackResult
import io.featureprobe.api.dao.entity.WebHookSettings
import io.featureprobe.api.dao.repository.WebHookSettingsRepository
import spock.lang.Specification

class WebHookPostEventSpec extends Specification {

    WebHookSettingsRepository settingsRepository

    WebHookPostEventListener webHookPostEventListener

    def setup(){
        settingsRepository = Mock(WebHookSettingsRepository)
        webHookPostEventListener = new WebHookPostEventListener(settingsRepository)
    }

    def "handle webhook post event"() {
        given:
        WebHookPostEvent event = new WebHookPostEvent(1, "Test WebHook",
                new CallbackResult(isSuccess: true, statusCode: 200, time: new Date()), "")
        when:
        webHookPostEventListener.onApplicationEvent(event)
        then:
        1 *  settingsRepository.findByOrganizationIdAndName(1,
                "Test WebHook") >> Optional.of(new WebHookSettings(organizationId: 1, name: "Test WebHook"))
        1 * settingsRepository.save(_)
    }


}

