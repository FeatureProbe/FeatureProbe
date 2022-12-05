package com.featureprobe.api.service

import com.featureprobe.api.auth.UserPasswordAuthenticationProvider
import com.featureprobe.api.auth.UserPasswordAuthenticationToken
import com.featureprobe.api.base.enums.RoleEnum
import com.featureprobe.api.dao.entity.Member
import com.featureprobe.api.dao.repository.OperationLogRepository
import spock.lang.Specification

class UserPasswordAuthenticationSpec extends Specification {

    MemberService memberService

    OperationLogService operationLogService

    OperationLogRepository operationLogRepository

    UserPasswordAuthenticationProvider userPasswordAuthenticationProvider

    UserPasswordAuthenticationToken token

    def setup() {
        this.memberService = Mock(MemberService)
        this.operationLogRepository = Mock(OperationLogRepository)
        this.operationLogService = new OperationLogService(operationLogRepository)
        this.userPasswordAuthenticationProvider = new UserPasswordAuthenticationProvider(memberService, operationLogService)
        token = new UserPasswordAuthenticationToken("admin", "", "abc12345")
    }

    def "user password is pass"() {
        when:
        def authenticate = userPasswordAuthenticationProvider.authenticate(token)
        then:
        1 * memberService.findByAccount("admin") >> Optional.of(new Member(account: "Admin",
                password: "\$2a\$10\$jeJ25nROU8APkG2ixK6zyecwzIJ8oHz0ZNqBDiwMXcy9lo9S3YGma"))
        1 * memberService.updateVisitedTime("admin")
        1 * operationLogRepository.save(_)
        with(authenticate) {
            "Admin" == ((UserPasswordAuthenticationToken) authenticate).getAccount()
        }
    }

}

