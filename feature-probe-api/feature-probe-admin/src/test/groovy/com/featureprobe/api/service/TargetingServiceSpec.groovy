package com.featureprobe.api.service


import com.featureprobe.api.base.enums.ApprovalStatusEnum
import com.featureprobe.api.base.enums.OrganizationRoleEnum
import com.featureprobe.api.base.enums.SketchStatusEnum
import com.featureprobe.api.base.model.OrganizationMemberModel
import com.featureprobe.api.base.model.TargetingContent
import com.featureprobe.api.base.tenant.TenantContext
import com.featureprobe.api.base.util.JsonMapper
import com.featureprobe.api.dao.exception.ResourceNotFoundException
import com.featureprobe.api.dto.CancelSketchRequest
import com.featureprobe.api.dto.TargetingApprovalRequest
import com.featureprobe.api.dto.TargetingPublishRequest
import com.featureprobe.api.dto.TargetingVersionRequest
import com.featureprobe.api.dto.UpdateApprovalStatusRequest
import com.featureprobe.api.dao.entity.ApprovalRecord
import com.featureprobe.api.dao.entity.Environment
import com.featureprobe.api.dao.entity.Targeting
import com.featureprobe.api.dao.entity.TargetingSketch
import com.featureprobe.api.dao.entity.TargetingVersion
import com.featureprobe.api.dao.repository.ApprovalRecordRepository
import com.featureprobe.api.dao.repository.PublishMessageRepository
import com.featureprobe.api.dao.repository.DictionaryRepository
import com.featureprobe.api.dao.repository.EnvironmentRepository
import com.featureprobe.api.dao.repository.SegmentRepository
import com.featureprobe.api.dao.repository.TargetingRepository
import com.featureprobe.api.dao.repository.TargetingSegmentRepository
import com.featureprobe.api.dao.repository.TargetingSketchRepository
import com.featureprobe.api.dao.repository.TargetingVersionRepository
import com.featureprobe.api.dao.repository.VariationHistoryRepository
import org.hibernate.internal.SessionImpl
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.context.SecurityContextImpl
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import spock.lang.Specification
import spock.lang.Title

import javax.persistence.EntityManager

@Title("Targeting Unit Test")
class TargetingServiceSpec extends Specification {

    TargetingService targetingService;

    TargetingRepository targetingRepository
    SegmentRepository segmentRepository
    TargetingSegmentRepository targetingSegmentRepository
    TargetingVersionRepository targetingVersionRepository
    VariationHistoryRepository variationHistoryRepository
    EnvironmentRepository environmentRepository
    ApprovalRecordRepository approvalRecordRepository
    TargetingSketchRepository targetingSketchRepository
    ChangeLogService changeLogService
    PublishMessageRepository changeLogRepository
    DictionaryRepository dictionaryRepository
    EntityManager entityManager

    def projectKey
    def environmentKey
    def toggleKey
    def content
    def numberErrorContent
    def datetimeErrorContent
    def semVerErrorContent
    ApprovalRecord approvalRecord
    TargetingSketch targetingSketch

    def setup() {
        targetingRepository = Mock(TargetingRepository)
        segmentRepository = Mock(SegmentRepository)
        targetingSegmentRepository = Mock(TargetingSegmentRepository)
        targetingVersionRepository = Mock(TargetingVersionRepository)
        variationHistoryRepository = Mock(VariationHistoryRepository)
        environmentRepository = Mock(EnvironmentRepository)
        approvalRecordRepository = Mock(ApprovalRecordRepository)
        targetingSketchRepository = Mock(TargetingSketchRepository)
        entityManager = Mock(SessionImpl)
        changeLogRepository = Mock(PublishMessageRepository)
        dictionaryRepository = Mock(DictionaryRepository)
        changeLogService = new ChangeLogService(changeLogRepository, environmentRepository, dictionaryRepository)
        targetingService = new TargetingService(targetingRepository, segmentRepository,
                targetingSegmentRepository, targetingVersionRepository, variationHistoryRepository,
                environmentRepository, approvalRecordRepository, targetingSketchRepository, changeLogService, entityManager)

        projectKey = "feature_probe"
        environmentKey = "test"
        toggleKey = "feature_toggle_unit_test"
        content = "{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"city\",\"predicate\":\"is one of\"," +
                "\"objects\":[\"Paris\"]},{\"type\":\"segment\",\"subject\":\"\",\"predicate\":\"is in\"," +
                "\"objects\":[\"test_segment\"]},{\"type\":\"number\",\"subject\":\"age\",\"predicate\":\"=\"," +
                "\"objects\":[\"20\"]},{\"type\":\"datetime\",\"subject\":\"\",\"predicate\":\"before\"," +
                "\"objects\":[\"2022-06-27T16:08:10+08:00\"]},{\"type\":\"semver\",\"subject\":\"\"," +
                "\"predicate\":\"before\",\"objects\":[\"1.0.1\"]}],\"name\":\"Paris women show 50% red buttons, 50% blue\"," +
                "\"serve\":{\"split\":[5000,5000,0]}}],\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1}," +
                "\"variations\":[{\"value\":\"red\",\"name\":\"Red Button\",\"description\":\"Set button color to Red\"}," +
                "{\"value\":\"blue\",\"name\":\"Blue Button\",\"description\":\"Set button color to Blue\"}]}"
        numberErrorContent = "{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"city\"," +
                "\"predicate\":\"is one of\",\"objects\":[\"Paris\"]},{\"type\":\"segment\",\"subject\":\"\"," +
                "\"predicate\":\"is in\",\"objects\":[\"test_segment\"]},{\"type\":\"number\",\"subject\":\"age\"," +
                "\"predicate\":\"=\",\"objects\":[\"20\",\"abc\"]},{\"type\":\"datetime\",\"subject\":\"\"," +
                "\"predicate\":\"before\",\"objects\":[\"2022-06-27T16:08:10+08:00\"]},{\"type\":\"semver\"," +
                "\"subject\":\"\",\"predicate\":\"before\",\"objects\":[\"1.0.1\"]}]," +
                "\"name\":\"Paris women show 50% red buttons, 50% blue\",\"serve\":{\"split\":[5000,5000,0]}}]," +
                "\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"red\"," +
                "\"name\":\"Red Button\",\"description\":\"Set button color to Red\"},{\"value\":\"blue\"," +
                "\"name\":\"Blue Button\",\"description\":\"Set button color to Blue\"}]}"
        datetimeErrorContent = "{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"city\"," +
                "\"predicate\":\"is one of\",\"objects\":[\"Paris\"]},{\"type\":\"segment\",\"subject\":\"\"," +
                "\"predicate\":\"is in\",\"objects\":[\"test_segment\"]},{\"type\":\"number\",\"subject\":\"age\"," +
                "\"predicate\":\"=\",\"objects\":[\"20\",\"abc\"]},{\"type\":\"datetime\",\"subject\":\"\"," +
                "\"predicate\":\"before\",\"objects\":[\"2022/06/27 16:08:10+08:00\",\"2022/06/27 80:08:10+08:00\"]}," +
                "{\"type\":\"semver\",\"subject\":\"\",\"predicate\":\"before\",\"objects\":[\"1.0.1\"]}]," +
                "\"name\":\"Paris women show 50% red buttons, 50% blue\",\"serve\":{\"split\":[5000,5000,0]}}]," +
                "\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"red\"," +
                "\"name\":\"Red Button\",\"description\":\"Set button color to Red\"},{\"value\":\"blue\"," +
                "\"name\":\"Blue Button\",\"description\":\"Set button color to Blue\"}]}"
        semVerErrorContent = "{\"rules\":[{\"conditions\":[{\"type\":\"string\",\"subject\":\"city\"," +
                "\"predicate\":\"is one of\",\"objects\":[\"Paris\"]},{\"type\":\"segment\",\"subject\":\"\"," +
                "\"predicate\":\"is in\",\"objects\":[\"test_segment\"]},{\"type\":\"number\",\"subject\":\"age\"," +
                "\"predicate\":\"=\",\"objects\":[\"20\",\"abc\"]},{\"type\":\"datetime\",\"subject\":\"\"," +
                "\"predicate\":\"before\",\"objects\":[\"2022/06/27 16:08:10+08:00\",\"2022/06/27 80:08:10+08:00\"]}," +
                "{\"type\":\"semver\",\"subject\":\"\",\"predicate\":\"before\",\"objects\":[\"1.0.1\",\"1.1\"]}]," +
                "\"name\":\"Paris women show 50% red buttons, 50% blue\",\"serve\":{\"split\":[5000,5000,0]}}]," +
                "\"disabledServe\":{\"select\":1},\"defaultServe\":{\"select\":1},\"variations\":[{\"value\":\"red\"," +
                "\"name\":\"Red Button\",\"description\":\"Set button color to Red\"},{\"value\":\"blue\"," +
                "\"name\":\"Blue Button\",\"description\":\"Set button color to Blue\"}]}"
        approvalRecord = new ApprovalRecord(id: 1, organizationId: -1, projectKey: "projectKey",
                environmentKey: "environmentKey", toggleKey: "toggleKey", submitBy: "Admin", approvedBy: "Test", reviewers: "[\"Admin\"]", status: ApprovalStatusEnum.PENDING, title: "title")
        targetingSketch = new TargetingSketch(approvalId: 1, organizationId: -1, projectKey: "projectKey",
                environmentKey: "environmentKey", toggleKey: "toggleKey", oldVersion: 1, content: content, comment: "test", disabled: true, status: SketchStatusEnum.PENDING)
        TenantContext.setCurrentOrganization(new OrganizationMemberModel(1, "organization", OrganizationRoleEnum.OWNER))
    }

    def "publish targeting"() {
        given:
        TargetingPublishRequest targetingRequest = new TargetingPublishRequest()
        TargetingContent targetingContent = JsonMapper.toObject(content, TargetingContent.class);
        targetingRequest.setContent(targetingContent)
        targetingRequest.setDisabled(false)


        when:
        def ret = targetingService.publish(projectKey, environmentKey, toggleKey, targetingRequest)

        then:
        segmentRepository.existsByProjectKeyAndKey(projectKey, _) >> true
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(enableApproval: false, version: 1))
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.of(new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                        content: "", disabled: true, version: 1))
        1 * targetingRepository.saveAndFlush(_) >> new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                content: "", disabled: false, version: 2)

        1 * targetingSegmentRepository.deleteByTargetingId(1)
        1 * targetingSegmentRepository.saveAll(_)

        1 * targetingVersionRepository.save(_)
        1 * variationHistoryRepository.saveAll(_)

        with(ret) {
            content == it.content
            false == it.disabled
        }
    }

    def "submit targeting approval"() {
        given:
        TargetingContent targetingContent = JsonMapper.toObject(content, TargetingContent.class)
        TargetingApprovalRequest approvalRequest = new TargetingApprovalRequest(content: targetingContent, comment: "Test", disabled: false, reviewers: ["test@test.com"])
        setAuthContext("Admin", "ADMIN")
        when:
        def approval = targetingService.approval(projectKey, environmentKey, toggleKey, approvalRequest)
        then:
        segmentRepository.existsByProjectKeyAndKey(projectKey, _) >> true
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(enableApproval: true, version: 1))
        2 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey,
                toggleKey) >> Optional.of(new Targeting(toggleKey: toggleKey, environmentKey: environmentKey,
                content: content, disabled: false))
        1 * approvalRecordRepository.save(_) >> approvalRecord
        1 * targetingSketchRepository.save(_)
    }

    def "publish targeting segment not found"() {
        when:
        TargetingPublishRequest targetingRequest = new TargetingPublishRequest()
        TargetingContent targetingContent = JsonMapper.toObject(content, TargetingContent.class);
        targetingRequest.setContent(targetingContent)
        targetingRequest.setDisabled(false)
        targetingService.publish(projectKey, environmentKey, toggleKey, targetingRequest)
        then:
        segmentRepository.existsByProjectKeyAndKey(projectKey, _) >> false
        then:
        thrown(ResourceNotFoundException)
    }

    def "publish targeting number format error"() {
        when:
        TargetingPublishRequest targetingRequest = new TargetingPublishRequest()
        TargetingContent targetingContent = JsonMapper.toObject(numberErrorContent, TargetingContent.class);
        targetingRequest.setContent(targetingContent)
        targetingService.publish(projectKey, environmentKey, toggleKey, targetingRequest)
        then:
        1 * segmentRepository.existsByProjectKeyAndKey(projectKey, _) >> true
        thrown(IllegalArgumentException)
    }

    def "publish targeting datetime format error"() {
        when:
        TargetingPublishRequest targetingRequest = new TargetingPublishRequest()
        TargetingContent targetingContent = JsonMapper.toObject(datetimeErrorContent, TargetingContent.class);
        targetingRequest.setContent(targetingContent)
        targetingService.publish(projectKey, environmentKey, toggleKey, targetingRequest)
        then:
        1 * segmentRepository.existsByProjectKeyAndKey(projectKey, _) >> true
        thrown(IllegalArgumentException)
    }

    def "publish targeting semVer format error"() {
        when:
        TargetingPublishRequest targetingRequest = new TargetingPublishRequest()
        TargetingContent targetingContent = JsonMapper.toObject(semVerErrorContent, TargetingContent.class);
        targetingRequest.setContent(targetingContent)
        targetingService.publish(projectKey, environmentKey, toggleKey, targetingRequest)
        then:
        1 * segmentRepository.existsByProjectKeyAndKey(projectKey, _) >> true
        thrown(IllegalArgumentException)
    }

    def "query targeting by key"() {
        when:
        def ret = targetingService.queryByKey(projectKey, environmentKey, toggleKey)
        then:
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(enableApproval: false))
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.of(new Targeting(toggleKey: toggleKey, environmentKey: environmentKey,
                        content: content, disabled: false))
        1 * approvalRecordRepository.findAll(_, _) >> new PageImpl([new ApprovalRecord(status: ApprovalStatusEnum.PASS, reviewers: "[\"Admin\"]")], Pageable.ofSize(1), 1)
        1 * targetingSketchRepository.findAll(_, _) >> new PageImpl([new TargetingSketch(content: content, disabled: false, oldVersion: 1)], Pageable.ofSize(1), 1)
        with(ret) {
            content == it.content
            false == it.disabled
        }
    }

    def "query targeting by key & enable approval"() {
        when:
        def ret = targetingService.queryByKey(projectKey, environmentKey, toggleKey)
        then:
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(enableApproval: true, reviewers: "[\"Admin\"]"))
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.of(new Targeting(toggleKey: toggleKey, environmentKey: environmentKey,
                        content: content, disabled: false))
        1 * approvalRecordRepository.findAll(_, _) >> new PageImpl([approvalRecord], Pageable.ofSize(1), 1)
        1 * targetingSketchRepository.findAll(_, _) >> new PageImpl([targetingSketch], Pageable.ofSize(1), 1)
        with(ret) {
            content == it.content
            true == it.disabled
        }
    }

    def "query targeting version"() {
        when:
        def versions = targetingService.queryVersions(projectKey, environmentKey, toggleKey,
                new TargetingVersionRequest())
        then:
        1 * targetingVersionRepository
                .findAllByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey, _) >>
                new PageImpl<>([new TargetingVersion()], Pageable.ofSize(1), 1)
        1 == versions.size

    }

    def "query before targeting version by page"() {
        when:
        def versions = targetingService.queryVersions(projectKey, environmentKey, toggleKey,
                new TargetingVersionRequest(version: 10))
        then:
        1 * targetingVersionRepository
                .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndVersionLessThanOrderByVersionDesc(
                        projectKey, environmentKey, toggleKey, 10, _) >>
                new PageImpl<>([new TargetingVersion()], Pageable.ofSize(1), 1)
        1 == versions.size

    }

    def "query after targeting version"() {
        when:
        def afterVersion = targetingService.queryAfterVersion(projectKey, environmentKey,
                toggleKey, 10)
        then:
        1 * targetingVersionRepository
                .findAllByProjectKeyAndEnvironmentKeyAndToggleKeyAndVersionGreaterThanEqualOrderByVersionDesc(
                        projectKey, environmentKey, toggleKey, 10) >> [new TargetingVersion()]
        1 * targetingVersionRepository.countByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey,
                environmentKey, toggleKey) >> 2
        2 == afterVersion.total
        1 == afterVersion.versions.size()

    }

    def "update approval status to PASS"() {
        given:
        setAuthContext("Admin", "ADMIN")
        when:
        targetingService.updateApprovalStatus(projectKey, environmentKey, toggleKey, new UpdateApprovalStatusRequest(status: ApprovalStatusEnum.PASS, comment: "Pass"))
        then:
        1 * approvalRecordRepository.findAll(_, _) >> new PageImpl<>([approvalRecord], Pageable.ofSize(1), 1)
        1 * targetingSketchRepository.findAll(_, _) >> new PageImpl<>([targetingSketch], Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.of(new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                        content: "", disabled: false, version: 2))
        1 * approvalRecordRepository.saveAndFlush(_)
        1 * targetingRepository.save(_) >> new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                content: "", disabled: false, version: 2)
    }

    def "update approval status to REVOKE"() {
        given:
        setAuthContext("Admin", "ADMIN")
        when:
        targetingService.updateApprovalStatus(projectKey, environmentKey, toggleKey, new UpdateApprovalStatusRequest(status: ApprovalStatusEnum.REVOKE, comment: "Pass"))
        then:
        1 * approvalRecordRepository.findAll(_, _) >> new PageImpl<>([approvalRecord], Pageable.ofSize(1), 1)
        1 * targetingSketchRepository.findAll(_, _) >> new PageImpl<>([targetingSketch], Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.of(new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                        content: "", disabled: false, version: 2))
        1 * targetingSketchRepository.save(_)
        1 * approvalRecordRepository.saveAndFlush(_)
        1 * targetingRepository.save(_) >> new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                content: "", disabled: false, version: 2)
    }

    def "update approval status to JUMP"() {
        given:
        setAuthContext("Admin", "ADMIN")
        when:
        targetingService.updateApprovalStatus(projectKey, environmentKey, toggleKey, new UpdateApprovalStatusRequest(status: ApprovalStatusEnum.JUMP, comment: "Pass"))
        then:
        1 * environmentRepository.findByProjectKeyAndKey(projectKey, environmentKey) >> Optional.of(new Environment(enableApproval: false, version: 1))
        2 * approvalRecordRepository.findAll(_, _) >> new PageImpl<>([approvalRecord], Pageable.ofSize(1), 1)
        2 * targetingSketchRepository.findAll(_, _) >> new PageImpl<>([targetingSketch], Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey, toggleKey) >>
                Optional.of(new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                        content: "", disabled: false, version: 2))
        1 * targetingSketchRepository.save(_)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey,
                toggleKey) >> Optional.of(new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                content: "", disabled: true, version: 1))
        1 * targetingRepository.saveAndFlush(_) >> new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                content: "", disabled: false, version: 2)
        1 * targetingSegmentRepository.deleteByTargetingId(1)
        1 * targetingSegmentRepository.saveAll(_)
        1 * targetingVersionRepository.save(_)
        1 * variationHistoryRepository.saveAll(_)
        1 * approvalRecordRepository.saveAndFlush(_)
        1 * targetingRepository.save(_) >> new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                content: "", disabled: false, version: 2)
    }

    def "cancel targeting sketch"() {
        when:
        targetingService.cancelSketch(projectKey, environmentKey, toggleKey, new CancelSketchRequest(comment: ""))
        then:
        1 * approvalRecordRepository.findAll(_, _) >> new PageImpl<>([approvalRecord], Pageable.ofSize(1), 1)
        1 * targetingSketchRepository.findAll(_, _) >> new PageImpl<>([targetingSketch], Pageable.ofSize(1), 1)
        1 * targetingRepository.findByProjectKeyAndEnvironmentKeyAndToggleKey(projectKey, environmentKey,
                toggleKey) >> Optional.of(new Targeting(id: 1, toggleKey: toggleKey, environmentKey: environmentKey,
                content: "", disabled: false, version: 2))
        1 * targetingSketchRepository.save(_)
        1 * targetingRepository.save(_)
    }


    private setAuthContext(String account, String role) {
        SecurityContextHolder.setContext(new SecurityContextImpl(
                new JwtAuthenticationToken(new Jwt.Builder("21212").header("a", "a")
                        .claim("role", role).claim("account", account).build())))
    }

}

