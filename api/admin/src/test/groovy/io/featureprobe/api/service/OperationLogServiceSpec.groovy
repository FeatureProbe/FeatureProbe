package io.featureprobe.api.service


import io.featureprobe.api.dao.entity.OperationLog
import io.featureprobe.api.dao.repository.OperationLogRepository
import spock.lang.Specification

class OperationLogServiceSpec extends Specification {

    OperationLogRepository operationLogRepository

    OperationLogService operationLogService

    def setup() {
        operationLogRepository = Mock(OperationLogRepository)
        operationLogService = new OperationLogService(operationLogRepository)
    }

    def "saved operation log"() {
        when:
        operationLogService.save(new OperationLog("test", "Admin"))
        then:
        1 * operationLogRepository.save(_)
    }
}

