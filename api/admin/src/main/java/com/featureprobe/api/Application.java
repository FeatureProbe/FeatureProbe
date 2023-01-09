package com.featureprobe.api;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
@OpenAPIDefinition(info = @Info(title = "Feature Probe API", version = "1.0", description = "Feature Probe API"))
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        log.info("FeatureProbe API startup completed .");
    }

}
