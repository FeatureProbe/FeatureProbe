package io.featureprobe.api.auth;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
public class LDAPConfig {

    @Value("${app.security.ldap.url}")
    private String ldapUrl;

    @Value("${app.security.ldap.base}")
    public  String ldapBase ;

    @Value("${app.security.ldap.userDn}")
    private String ldapUserDn;

    @Value("${app.security.ldap.password}")
    private String ldapPassword;

    @Bean
    public LdapContextSource contextSource() {
        LdapContextSource contextSource = new LdapContextSource();
        contextSource.setUrl(ldapUrl);
        contextSource.setUserDn(ldapUserDn);
        contextSource.setPassword(ldapPassword);
        contextSource.setBase(ldapBase);
        contextSource.afterPropertiesSet();
        return contextSource;
    }

    @Bean
    public LdapTemplate ldapTemplate()  {
        return new LdapTemplate(contextSource());
    }
}
