package io.featureprobe.api.auth;

import io.featureprobe.api.base.util.KeyGenerateUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
public class AccessTokenAuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {

    private static final String ACCESS_TOKEN_HEADER = "Authorization";

    protected AccessTokenAuthenticationProcessingFilter() {
        super(request -> {
            String authorization = request.getHeader(ACCESS_TOKEN_HEADER);
            return StringUtils.isNotBlank(authorization) &&
                    authorization.trim().startsWith(KeyGenerateUtil.ACCESS_TOKEN_PREFIX);
        });
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        String token = StringUtils.trim(request.getHeader(ACCESS_TOKEN_HEADER));

        return getAuthenticationManager().authenticate(new AccessTokenAuthenticationToken(token));
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult)
            throws IOException, ServletException {
        SecurityContextHolder.getContext().setAuthentication(authResult);
        chain.doFilter(request, response);
    }

}
