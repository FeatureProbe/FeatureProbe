package io.featureprobe.api.controller;

import io.featureprobe.api.base.db.ExcludeTenant;
import io.featureprobe.api.dto.TrafficCreateRequest;
import io.featureprobe.api.dto.SdkKeyResponse;
import io.featureprobe.api.dto.ServerResponse;
import io.featureprobe.api.server.ServerDataSource;
import io.featureprobe.api.service.EnvironmentService;
import io.featureprobe.api.service.TrafficService;
import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Objects;

@Slf4j
@RestController
@RequestMapping("/internal/server/")
@AllArgsConstructor
@Hidden
public class ServerController {
    private TrafficService trafficService;

    private ServerDataSource dataSource;

    private EnvironmentService environmentService;

    @GetMapping("/sdk_keys")
    public SdkKeyResponse queryAllSdkKeys(@RequestParam(value = "version", required = false) Long version,
                                          HttpServletResponse response) throws Exception {
        SdkKeyResponse sdkKeyResponse = dataSource.queryAllSdkKeys();
        if (Objects.isNull(sdkKeyResponse)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        } else if (Objects.nonNull(version) && version >= sdkKeyResponse.getVersion()) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            return null;
        }
        return sdkKeyResponse;
    }

    @GetMapping("/toggles")
    public ServerResponse fetchToggles(@Parameter(description = "sdk key")
                                       @RequestHeader(value = "Authorization") String sdkKey,
                                       @RequestParam(value = "version", required = false) Long version,
                                       HttpServletResponse response) throws Exception {
        ServerResponse serverResponse = dataSource.queryServerTogglesByServerSdkKey(sdkKey);
        if (Objects.isNull(serverResponse)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        } else if (Objects.nonNull(version) && version >= serverResponse.getVersion()) {
            response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
            return null;
        }
        return serverResponse;
    }

    @PostMapping("/events")
    @ExcludeTenant
    public void createEvent(
            @RequestBody @Validated List<TrafficCreateRequest> batchRequest,
            @Parameter(description = "sdk key")
            @RequestHeader(value = "Authorization") String sdkKey,
            @RequestHeader(value = "user-agent", required = false) String userAgent,
            @RequestHeader(value = "UA", required = false) String javascriptUserAgent) {
        if (StringUtils.isNotBlank(javascriptUserAgent)) {
            userAgent = javascriptUserAgent;
        }
        trafficService.create(environmentService.getSdkServerKey(sdkKey), userAgent, batchRequest);
    }

}
