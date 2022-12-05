package com.featureprobe.api.config;

import com.featureprobe.sdk.server.FPConfig;
import com.featureprobe.sdk.server.FeatureProbe;
import lombok.AllArgsConstructor;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.net.MalformedURLException;
import java.net.URL;
import java.time.Duration;

@Configuration
@AllArgsConstructor
public class FeatureProbeConfig {

    private ServerProperties serverProperties;
    private static final String LOCAL_HOST = "http://127.0.0.1";
    private static final String FEATURE_PROBE_API_EVENT_PATH = "/api/server/events";
    private static final String FEATURE_PROBE_API_SYNCHRONIZER_PATH = "/api/server/toggles";
    private static final String MANAGER_PROJECT_SDK_KEY = "server-t6h78815ef044428826787e9a238b9c6a479f998";

    @Bean
    @Lazy
    public FeatureProbe featureProbe() throws MalformedURLException {
        FPConfig config = FPConfig.builder()
                .eventUrl(new URL(LOCAL_HOST + ":" + serverProperties.getPort() + FEATURE_PROBE_API_EVENT_PATH))
                .synchronizerUrl(new URL(LOCAL_HOST + ":" + serverProperties.getPort() +
                        FEATURE_PROBE_API_SYNCHRONIZER_PATH))
                .pollingMode(Duration.ofSeconds(3))
                .useMemoryRepository()
                .build();
        return new FeatureProbe(MANAGER_PROJECT_SDK_KEY, config);
    }

}
