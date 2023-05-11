package io.featureprobe.api.config;

import io.featureprobe.api.component.SdkVersionScheduler;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
@ComponentScan(basePackageClasses = {
        SdkVersionScheduler.class,
})
public class ScheduleConfig {
}
