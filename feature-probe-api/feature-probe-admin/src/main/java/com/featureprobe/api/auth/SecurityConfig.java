package com.featureprobe.api.auth;

import com.featureprobe.api.config.JWTConfig;
import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import com.featureprobe.api.base.model.BaseResponse;
import com.featureprobe.api.base.util.JsonMapper;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

@Slf4j
@Configuration
@EnableWebSecurity
@AllArgsConstructor
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private LoginFailureHandler loginFailureHandler;

    private LoginSuccessHandler loginSuccessHandler;

    private JWTConfig jwtConfig;

    private UserPasswordAuthenticationProvider userPasswordAuthenticationProvider;

    private GuestAuthenticationProvider guestAuthenticationProvider;

    private AccessTokenAuthenticationProvider accessTokenAuthenticationProvider;

    UserPasswordAuthenticationProcessingFilter userPasswordAuthenticationProcessingFilter(
            AuthenticationManager authenticationManager) {
        UserPasswordAuthenticationProcessingFilter userPasswordAuthenticationProcessingFilter =
                new UserPasswordAuthenticationProcessingFilter();
        userPasswordAuthenticationProcessingFilter.setAuthenticationManager(authenticationManager);
        userPasswordAuthenticationProcessingFilter.setAuthenticationSuccessHandler(loginSuccessHandler);
        userPasswordAuthenticationProcessingFilter.setAuthenticationFailureHandler(loginFailureHandler);
        return userPasswordAuthenticationProcessingFilter;
    }

    GuestAuthenticationProcessingFilter guestAuthenticationProcessingFilter(
            AuthenticationManager authenticationManager) {
        GuestAuthenticationProcessingFilter guestAuthenticationProcessingFilter = new
                GuestAuthenticationProcessingFilter();
        guestAuthenticationProcessingFilter.setAuthenticationManager(authenticationManager);
        guestAuthenticationProcessingFilter.setAuthenticationFailureHandler(loginFailureHandler);
        guestAuthenticationProcessingFilter.setAuthenticationSuccessHandler(loginSuccessHandler);
        return guestAuthenticationProcessingFilter;
    }

    AccessTokenAuthenticationProcessingFilter accessTokenAuthenticationProcessingFilter(
            AuthenticationManager authenticationManager) {
        AccessTokenAuthenticationProcessingFilter accessTokenAuthenticationProcessingFilter = new
                AccessTokenAuthenticationProcessingFilter();
        accessTokenAuthenticationProcessingFilter.setAuthenticationManager(authenticationManager);
        accessTokenAuthenticationProcessingFilter.setAuthenticationFailureHandler(loginFailureHandler);

        return accessTokenAuthenticationProcessingFilter;
    }

    @Bean
    AuthenticationEntryPoint authenticationEntryPoint() {
        AuthenticationEntryPoint authenticationEntryPoint = (httpServletRequest, httpServletResponse, e) ->
        {
            BaseResponse res = new BaseResponse(HttpStatus.UNAUTHORIZED.name().toLowerCase(),
                    HttpStatus.UNAUTHORIZED.getReasonPhrase());
            httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value());
            httpServletResponse.setContentType(MediaType.APPLICATION_JSON_VALUE);
            httpServletResponse.setCharacterEncoding(StandardCharsets.UTF_8.name());
            httpServletResponse.getWriter().write(JsonMapper.toJSONString(res));
        };
        return authenticationEntryPoint;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.headers().frameOptions().disable();
        http.csrf().disable();
        http
                .formLogin()
                .loginProcessingUrl("/api/login")
                .and()
                .authorizeRequests()
                .antMatchers("/internal/**", "/api/login", "/api/guestLogin", "/api/v3/api-docs.yaml")
                .permitAll()
//                .antMatchers("/api/projects/**").hasAnyAuthority(OrganizationRoleEnum.OWNER.name(),
//                        OrganizationRoleEnum.WRITER.name())
                .antMatchers("/api/**").authenticated()
                .and()
                .exceptionHandling()
                .accessDeniedHandler(((httpServletRequest, httpServletResponse, e) ->
                        httpServletResponse.setStatus(HttpStatus.UNAUTHORIZED.value())))
                .authenticationEntryPoint(authenticationEntryPoint());
        http.addFilterBefore(userPasswordAuthenticationProcessingFilter(authenticationManager()),
                UsernamePasswordAuthenticationFilter.class);
        if (!jwtConfig.isGuestDisabled()) {
            http.addFilterBefore(guestAuthenticationProcessingFilter(authenticationManager()),
                    UserPasswordAuthenticationProcessingFilter.class);
        }
        http.addFilterBefore(accessTokenAuthenticationProcessingFilter(authenticationManager()),
                UserPasswordAuthenticationProcessingFilter.class);

        http.oauth2ResourceServer().jwt().jwtAuthenticationConverter(authenticationConverter());
    }

    @Override
    protected AuthenticationManager authenticationManager() {
        ProviderManager authenticationManager = new ProviderManager(Arrays.asList(userPasswordAuthenticationProvider,
                guestAuthenticationProvider, accessTokenAuthenticationProvider));
        return authenticationManager;
    }

    protected JwtAuthenticationConverter authenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter = new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthorityPrefix("");
        authoritiesConverter.setAuthoritiesClaimName(JwtHelper.AUTHORITIES_CLAIM_NAME);
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }
}
