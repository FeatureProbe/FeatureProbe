package com.featureprobe.api.controller;

import com.featureprobe.api.base.enums.LoginMode;
import com.featureprobe.api.config.JWTConfig;
import com.featureprobe.api.dto.AppSettingsResponse;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Map;


@Slf4j
@RestController
@RequestMapping("/api/application")
@Hidden
public class ApplicationController {

    private JWTConfig jwtConfig;

    public ApplicationController(JWTConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    @Value("${app.get-started-server-url}")
    private String serverURI;

    @RequestMapping("/settings")
    public AppSettingsResponse getSettings() {
        AppSettingsResponse appSettingsResponse = new AppSettingsResponse();
        appSettingsResponse.setLoginMode(jwtConfig.isGuestDisabled() ? LoginMode.PASSWORD : LoginMode.GUEST);
        appSettingsResponse.setServerURI(serverURI);

        return appSettingsResponse;
    }
    public static void main(String []args) {
        Map map = Maps.newHashMap();

        map.put(Arrays.asList(2, 1), new Object());

        System.out.println(map.get(Arrays.asList(2, 1.0)));
    }
}
