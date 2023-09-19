package io.featureprobe.api.service

import io.featureprobe.api.auth.PlaintextEncryptionService
import io.featureprobe.api.base.component.SpringBeanManager
import io.featureprobe.api.dao.entity.OperationLog
import io.featureprobe.api.dao.repository.OperationLogRepository
import org.springframework.context.ApplicationContext
import spock.lang.Specification

class OperationLogServiceSpec extends Specification {

    OperationLogRepository operationLogRepository

    OperationLogService operationLogService

    ApplicationContext applicationContext

    def setup() {
        operationLogRepository = Mock(OperationLogRepository)
        applicationContext = Mock(ApplicationContext)
        operationLogService = new OperationLogService(operationLogRepository)
        SpringBeanManager.applicationContext = applicationContext
    }

    def "saved operation log"() {
        when:
        operationLogService.save(new OperationLog("test", "Admin"))
        then:
        1 * applicationContext.getBean(_) >> new PlaintextEncryptionService()
        1 * operationLogRepository.save(_)
    }
}

