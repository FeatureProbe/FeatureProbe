package io.featureprobe.api.service

import io.featureprobe.api.dto.ApprovalRecordQueryRequest
import io.featureprobe.api.base.enums.ApprovalStatusEnum
import io.featureprobe.api.base.enums.ApprovalTypeEnum
import io.featureprobe.api.base.enums.SketchStatusEnum
import io.featureprobe.api.dao.entity.ApprovalRecord
import io.featureprobe.api.dao.entity.Environment
import io.featureprobe.api.dao.entity.Project
import io.featureprobe.api.dao.entity.TargetingSketch
import io.featureprobe.api.dao.entity.Toggle
import io.featureprobe.api.dao.repository.ApprovalRecordRepository
import io.featureprobe.api.dao.repository.EnvironmentRepository
import io.featureprobe.api.dao.repository.ProjectRepository
import io.featureprobe.api.dao.repository.TargetingSketchRepository
import io.featureprobe.api.dao.repository.ToggleRepository
import org.hibernate.internal.SessionImpl
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import spock.lang.Specification

import javax.persistence.EntityManager

class ApprovalRecordServiceSpec extends Specification {

    ApprovalRecordService approvalRecordService
    ProjectRepository projectRepository
    EnvironmentRepository environmentRepository
    ToggleRepository toggleRepository
    ApprovalRecordRepository approvalRecordRepository
    TargetingSketchRepository targetingSketchRepository
    ApprovalRecord approvalRecord
    ApprovalRecord approvalRecord2
    EntityManager entityManager

    def setup() {
        projectRepository = Mock(ProjectRepository)
        environmentRepository = Mock(EnvironmentRepository)
        toggleRepository = Mock(ToggleRepository)
        approvalRecordRepository = Mock(ApprovalRecordRepository)
        targetingSketchRepository = Mock(TargetingSketchRepository)
        entityManager = Mock(SessionImpl)
        approvalRecordService = new ApprovalRecordService(projectRepository, environmentRepository, toggleRepository,
                approvalRecordRepository, targetingSketchRepository, entityManager)
        approvalRecord = new ApprovalRecord(id: 1, organizationId: -1, projectKey: "projectKey",
                environmentKey: "environmentKey", toggleKey: "toggleKey", submitBy: "Admin", approvedBy: "Test", reviewers: "[\"manager\"]", status: ApprovalStatusEnum.PENDING, title: "title")
        approvalRecord2 = new ApprovalRecord(id: 2, organizationId: -1, projectKey: "projectKey",
                environmentKey: "environmentKey", toggleKey: "toggleKey", submitBy: "Admin", approvedBy: "Test", reviewers: "[\"manager\"]", status: ApprovalStatusEnum.PENDING, title: "title")
    }

    def "Query approval record list"() {
        when:
        def list = approvalRecordService.list(new ApprovalRecordQueryRequest(keyword: "test", status: [ApprovalStatusEnum.PENDING], type: ApprovalTypeEnum.APPLY))
        then:
        1 * approvalRecordRepository.findAll(_, _) >> new PageImpl<>([approvalRecord, approvalRecord2], Pageable.ofSize(2), 2)
        1 * targetingSketchRepository.findByApprovalIdIn(_) >> [new TargetingSketch(approvalId: 1, modifiedTime: new Date(), status: SketchStatusEnum.PENDING),
                                                                new TargetingSketch(approvalId: 2, modifiedTime: new Date(), status: SketchStatusEnum.CANCEL)]
        1 * projectRepository.findByKeyIn(_) >> [new Project(name: "projectName", key: "projectKey")]
        1 * environmentRepository.findByKeyIn(_) >> [new Environment(name: "environmentName", key: "environmentKey", project: new Project(key: "projectKey"))]
        1 * toggleRepository.findByKeyIn(_) >> [new Toggle(name: "toggleName", projectKey: "projectKey", key: "toggleKey")]
        2 == list.content.size()
    }

    def "Query approval record total by status"() {
        given:
        setAuthContext("Admin", "ADMIN")
        when:
        def total = approvalRecordService.total(ApprovalStatusEnum.PENDING)
        then:
        1 * approvalRecordRepository.countByStatusAndReviewersIsContaining(ApprovalStatusEnum.PENDING, "\"Admin\"") >> 1
        1 == total
    }

    private setAuthContext(String account, String role) {
        SecurityContextHolder.setContext(new SecurityContextImpl(
                new JwtAuthenticationToken(new Jwt.Builder("21212").header("a", "a")
                        .claim("role", role).claim("account", account).build())))
    }
}

