package com.featureprobe.api.service

import com.featureprobe.api.auth.TokenHelper
import com.featureprobe.api.dao.entity.Dictionary
import com.featureprobe.api.dao.repository.DictionaryRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import spock.lang.Specification

class DictionaryServiceSpec extends Specification {

    DictionaryRepository dictionaryRepository
    DictionaryService dictionaryService

    def setup() {
        dictionaryRepository = Mock(DictionaryRepository)
        dictionaryService = new DictionaryService(dictionaryRepository)
    }

    def "save dictionary"() {
        given:
        setAuthContext("Admin", "OWNER")
        when:
        def dictionary = dictionaryService.create("key", "value")
        then:
        1 * dictionaryRepository.findByAccountAndKey("Admin", "key") >>
                Optional.of(new Dictionary())
        1 * dictionaryRepository.save(_) >> new Dictionary(key: "key", value: "value")
        "key" == dictionary.key
        "value" == dictionary.value
    }

    def "update dictionary"() {
        given:
        setAuthContext("Admin", "OWNER")
        when:
        def dictionary = dictionaryService.create("key", "value")
        then:
        1 * dictionaryRepository.findByAccountAndKey("Admin", "key") >>
                Optional.empty()
        1 * dictionaryRepository.save(_) >> new Dictionary(key: "key", value: "value")
        "key" == dictionary.key
        "value" == dictionary.value
    }

    def "query dictionary"() {
        given:
        setAuthContext("Admin", "OWNER")
        when:
        def dictionary = dictionaryService.query("key")
        then:
        1 * dictionaryRepository.findByAccountAndKey(TokenHelper.getAccount(), "key") >> Optional.of(new Dictionary(key: "key", value: "value"))
        "key" == dictionary.key
        "value" == dictionary.value
    }

    private setAuthContext(String account, String role) {
        SecurityContextHolder.setContext(new SecurityContextImpl(
                new JwtAuthenticationToken(new Jwt.Builder("21212").header("a", "a")
                        .claim("role", role).claim("account", account).build())))
    }
}

