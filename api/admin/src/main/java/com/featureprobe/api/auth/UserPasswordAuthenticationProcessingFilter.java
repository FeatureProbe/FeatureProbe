package com.featureprobe.api.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
public class UserPasswordAuthenticationProcessingFilter extends AbstractAuthenticationProcessingFilter {

    private static final String GUEST_LOGIN_PATH = "/api/login";

    private static final String GUEST_LOGIN_ACCOUNT_PARAM = "account";

    private static final String ACCOUNT_SOURCE = "source";

    private static final String GUEST_LOGIN_PASSWORD_PARAM = "password";

    protected UserPasswordAuthenticationProcessingFilter() {
        super(GUEST_LOGIN_PATH);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException, IOException {
        ObjectMapper mapper = new ObjectMapper();
        InputStream is = request.getInputStream();
        String body = IOUtils.toString(is, StandardCharsets.UTF_8);
        Map<String, String> authParam = mapper.readValue(body, Map.class);
        String account = authParam.get(GUEST_LOGIN_ACCOUNT_PARAM);
        String source = authParam.get(ACCOUNT_SOURCE);
        String password = authParam.get(GUEST_LOGIN_PASSWORD_PARAM);
        return getAuthenticationManager().authenticate(new UserPasswordAuthenticationToken(account, source, password));
    }


    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
                                            Authentication authResult) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);
    }
}
