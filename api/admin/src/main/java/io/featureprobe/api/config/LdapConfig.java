package io.featureprobe.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

import java.util.Collections;

@Configuration
public class LdapConfig {

    @Value("${app.security.ldap.url:ldap://ldap.forumsys.com:389}")
    private String ldapUrl;

    @Value("${app.security.ldap.base:dc=example,dc=com}")
    public  String ldapBase ;

    @Value("${app.security.ldap.userDn:cn=read-only-admin,dc=example,dc=com}")
    private String ldapUserDn;

    @Value("${app.security.ldap.password:password}")
    private String ldapPassword;

    @Value("${app.security.ldap.connect.timeout:5000}")
    private String connectTimeout;

    @Value("${app.security.ldap.request.timeout:5000}")
    private int requestTimeout;

    @Value("${app.security.ldap.usernameAttribute:uid}")
    private String usernameAttribute;

    @Bean
    public LdapContextSource contextSource() {
        LdapContextSource contextSource = new LdapContextSource();
        contextSource.setUrl(ldapUrl);
        contextSource.setUserDn(ldapUserDn);
        contextSource.setPassword(ldapPassword);
        contextSource.setBase(ldapBase);
        contextSource.setBaseEnvironmentProperties(
                Collections.singletonMap("com.sun.jndi.ldap.connect.timeout", connectTimeout)
        );
        contextSource.afterPropertiesSet();
        return contextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate()  {
        LdapTemplate ldapTemplate = new LdapTemplate(contextSource());
        ldapTemplate.setDefaultTimeLimit(requestTimeout);
        ldapTemplate.setIgnorePartialResultException(true);
        return ldapTemplate;
    }

    @Bean
    public String ldapUsernameAttribute()  {
        return usernameAttribute;
    }
}
