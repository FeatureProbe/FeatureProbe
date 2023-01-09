package com.featureprobe.api.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "app.security.jwt")
public class JWTConfig {

    private String keystoreLocation;

    private String keystorePassword;

    private String keyAlias;

    private String privateKeyPassphrase;

    private List<String> excludeTenantUri;

    private boolean guestDisabled = true;

    private String guestDefaultPassword;

}
