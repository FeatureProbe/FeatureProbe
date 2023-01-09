package com.featureprobe.api.auth;

import com.featureprobe.api.base.model.OrganizationMemberModel;
import com.featureprobe.api.base.util.JsonMapper;
import com.featureprobe.api.dao.entity.Organization;
import com.featureprobe.api.dto.CertificationUserResponse;
import com.featureprobe.api.service.OrganizationService;
import lombok.AllArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final OrganizationService organizationService;
    private final JwtConfiguration jwtConfiguration;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        response.setStatus(HttpStatus.OK.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        UserPasswordAuthenticationToken token =
                (UserPasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        AuthenticatedMember principal = token.getPrincipal();

        List<OrganizationMemberModel> organizations = getOrganizationMemberModels(principal);
        if (CollectionUtils.isEmpty(organizations)) {
            throw new AuthenticationServiceException(principal.getName() + " organization is empty!");
        }
        String roleName = organizations.get(0).getRoleName();
        String jwt = JwtHelper.createJwtForMember(jwtConfiguration, principal, organizations, roleName);

        Long organizationId = CollectionUtils.isEmpty(principal.getOrganizations()) ? null :
                principal.getOrganizations().get(0).getId();
        response.getWriter().write(JsonMapper.toJSONString(new CertificationUserResponse(token.getAccount(),
                roleName, organizationId, jwt)));
    }

    private List<OrganizationMemberModel> getOrganizationMemberModels(AuthenticatedMember principal) {
        List<OrganizationMemberModel> organizations = new ArrayList<>();
        for (Organization organization : principal.getOrganizations()) {
            OrganizationMemberModel organizationMemberModel = organizationService
                    .queryOrganizationMember(organization.getId(), principal.getId());
            organizations.add(organizationMemberModel);
        }
        return organizations;
    }

}
