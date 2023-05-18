package io.featureprobe.api.auth;

import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.dao.entity.Organization;
import io.featureprobe.api.dto.CertificationUserResponse;
import io.featureprobe.api.service.OrganizationService;
import lombok.AllArgsConstructor;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
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
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

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
        OrganizationMemberModel organizationMember = principal.getOrganizationMemberModel();
        String jwt = JwtHelper.createJwtForMember(jwtConfiguration, principal, organizations,
                organizationMember.getRoleName());
        response.getWriter().write(new CertificationUserResponse(token.getAccount(),
                organizationMember.getRoleName(), organizationMember.getOrganizationId(), jwt).toJSONString());
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
