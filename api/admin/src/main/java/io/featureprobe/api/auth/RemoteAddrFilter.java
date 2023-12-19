package io.featureprobe.api.auth;

import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.utils.IpUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class RemoteAddrFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String remoteAddr = IpUtil.getRemoteIp(request);
        if (StringUtils.isNotBlank(remoteAddr)) {
            TenantContext.setCurrentRemoteAddr(remoteAddr);
        }
        filterChain.doFilter(request, response);
    }

}
