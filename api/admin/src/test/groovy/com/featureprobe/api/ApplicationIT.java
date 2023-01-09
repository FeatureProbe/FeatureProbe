package com.featureprobe.api;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = Application.class)
@ActiveProfiles({"it"})
class ApplicationIT {

    @Autowired
    ApplicationContext ctx;

    @Test
    void contextLoads() {
        assertThat(ctx).isNotNull();
    }
}
