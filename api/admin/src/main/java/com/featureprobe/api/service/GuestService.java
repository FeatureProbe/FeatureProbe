package com.featureprobe.api.service;

import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import com.featureprobe.api.config.JWTConfig;
import com.featureprobe.api.base.db.ExcludeTenant;
import com.featureprobe.api.dao.repository.OrganizationRepository;
import com.featureprobe.api.dto.ProjectCreateRequest;
import com.featureprobe.api.dao.entity.Member;
import com.featureprobe.api.dao.entity.Organization;
import com.featureprobe.api.dao.repository.MemberRepository;
import com.featureprobe.api.base.tenant.TenantContext;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.context.SecurityContextImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Slf4j
@AllArgsConstructor
@Service
@ExcludeTenant
public class GuestService {

    JWTConfig JWTConfig;

    private MemberRepository memberRepository;

    private OrganizationRepository organizationRepository;

    @PersistenceContext
    public EntityManager entityManager;

    private ProjectService projectService;

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    private static final String GUEST_INIT_PROJECT_KEY = "My_Project";

    private static final String DEMO_INIT_DATA_FILE_PATH = "db/demo_init_data.sql";

    @Transactional(rollbackFor = Exception.class)
    public Member initGuest(String account, String source) {
        Organization organization = organizationRepository.save(new Organization(account));
        Member guestMember = createGuestMember(account, source, organization);

        loginGuestUser(guestMember);
        initProjectEnvironment(String.valueOf(organization.getId()), GUEST_INIT_PROJECT_KEY);
        initToggles(organization.getId(), guestMember.getId());
        return guestMember;
    }

    private Member createGuestMember(String account, String source, Organization organization) {
        Member member = new Member();
        member.setAccount(account);
        member.setPassword(passwordEncoder.encode(JWTConfig.getGuestDefaultPassword()));
        member.setSource(source);
        member.addOrganization(organization, OrganizationRoleEnum.OWNER);
        return memberRepository.save(member);
    }

    private void loginGuestUser(Member member) {
        SecurityContextHolder.setContext(new SecurityContextImpl(new JwtAuthenticationToken(Jwt.withTokenValue("_")
                .claim("userId", member.getId()).claim("account", member.getAccount())
                .claim("role", member.getOrganizationMembers().get(0).getRole())
                .header("iss", "")
                .build())));
    }

    private void initProjectEnvironment(String tenantId, String projectName) {
        TenantContext.setCurrentTenant(tenantId);
        projectService.create(new ProjectCreateRequest(projectName,
                projectName, ""));
    }

    private void initToggles(Long tenantId, Long userId) {
        try {
            ClassPathResource classPathResource = new ClassPathResource(DEMO_INIT_DATA_FILE_PATH);
            BufferedReader br = new BufferedReader(new InputStreamReader(classPathResource.getInputStream()));
            String sql;
            while (StringUtils.isNotBlank((sql = br.readLine()))) {
                sql = sql.replace("${organization_id}", String.valueOf(tenantId))
                        .replace("${project_key}", GUEST_INIT_PROJECT_KEY)
                        .replace("${user_id}", String.valueOf(userId));
                executeSQL(sql);
            }
        } catch (IOException e) {
            log.error("Demo init toggles error.", e);
        }
    }

    private void executeSQL(String sql) {
        Query query = entityManager.createNativeQuery(sql);
        query.executeUpdate();
    }
}
