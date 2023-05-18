package io.featureprobe.api.filter;

import io.featureprobe.api.auth.OrganizationEmptyException;
import io.featureprobe.api.auth.TokenHelper;
import io.featureprobe.api.config.JWTConfig;
import io.featureprobe.api.base.model.BaseResponse;
import io.featureprobe.api.base.model.OrganizationMemberModel;
import io.featureprobe.api.service.OrganizationService;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.base.util.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Objects;

@Slf4j
@Component
@AllArgsConstructor
public class TenantFilter implements Filter {

    private static final String TENANT_HEADER = "X-OrganizeID";

    private static final String ORGANIZATION_ID_MISS_ERROR_MSG = "No OrganizationID supplied";

    private OrganizationService organizationService;

    private JWTConfig JWTConfig;

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        String requestURI = request.getRequestURI();
        if (!pass(requestURI)) {
            String tenantHeader = request.getHeader(TENANT_HEADER);
            try {
                if (StringUtils.isBlank(tenantHeader)) {
                    tenantHeader = TenantContext.getCurrentTenant();
                }
                if (StringUtils.isNotBlank(tenantHeader)) {
                    OrganizationMemberModel organizationMemberModel = organizationService
                            .queryOrganizationMember(Long.parseLong(tenantHeader), TokenHelper.getUserId());
                    if (Objects.isNull(organizationMemberModel)) {
                        throw new OrganizationEmptyException("User has no access to the organization.");
                    }
                    TenantContext.setCurrentTenant(tenantHeader);
                    TenantContext.setCurrentOrganization(organizationMemberModel);
                } else {
                    tenantErrorResponse(response);
                    return;
                }
            } catch (Exception e) {
                log.error("member not in the organization.", e);
                organizationErrorResponse(response);
            }
        }
        try {
            filterChain.doFilter(servletRequest, servletResponse);
        } finally {
            TenantContext.clear();
        }
    }

    private boolean pass(String uri) {
        AntPathMatcher matcher = new AntPathMatcher();
        for (String  pattern : JWTConfig.getExcludeTenantUri()) {
            if (!matcher.match("/api/**", uri) || matcher.match(pattern, uri)) {
                return true;
            }
        }
        return false;
    }

    private void tenantErrorResponse(HttpServletResponse response) throws IOException {
        BaseResponse res = new BaseResponse(HttpStatus.BAD_REQUEST.name().toLowerCase(),
                ORGANIZATION_ID_MISS_ERROR_MSG);
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(JsonMapper.toJSONString(res));
        response.getWriter().flush();
    }

    private void organizationErrorResponse(HttpServletResponse response) throws IOException {
        BaseResponse res = new BaseResponse(HttpStatus.FORBIDDEN.name().toLowerCase(),
                HttpStatus.FORBIDDEN.getReasonPhrase());
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(JsonMapper.toJSONString(res));
        response.getWriter().flush();
    }
}
