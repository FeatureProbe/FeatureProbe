package com.featureprobe.api.controller;

import com.featureprobe.api.base.enums.SDKType;
import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.EnvironmentKeyParameter;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.base.doc.ProjectKeyParameter;
import com.featureprobe.api.base.doc.ToggleKeyParameter;
import com.featureprobe.api.dto.AccessStatusResponse;
import com.featureprobe.api.dto.TrafficResponse;
import com.featureprobe.api.base.enums.TrafficType;
import com.featureprobe.api.service.TrafficChartService;
import com.featureprobe.api.validate.ResourceExistsValidate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/projects/{projectKey}/environments/{environmentKey}/toggles/{toggleKey}")
@DefaultApiResponses
@ProjectKeyParameter
@ToggleKeyParameter
@EnvironmentKeyParameter
@ResourceExistsValidate
@Tag(name = "Traffic", description = "The traffic API allows you to statistics toggle access events.")
public class TrafficController {

    private TrafficChartService trafficChartService;

    @GetApiResponse
    @GetMapping("/traffic")
    @Operation(summary = "Query Traffic", description = "Get the access statistics report of the toggle" +
            " for a period of time.")
    public TrafficResponse query(@PathVariable("projectKey") String projectKey,
                                 @PathVariable("environmentKey") String environmentKey,
                                 @PathVariable("toggleKey") String toggleKey,
                                 @Schema(description = "Metrics group type.")
                                @RequestParam(value = "trafficType", defaultValue = "VALUE")
                                    TrafficType trafficType,
                                 @Schema(description = "Metrics statistical time granularity.")
                                @RequestParam(value = "lastHours", defaultValue = "24") int lastHours) {

        return trafficChartService.query(projectKey, environmentKey, toggleKey, trafficType, lastHours);
    }

    @GetApiResponse
    @GetMapping("/access")
    @Operation(summary = "Get access status", description = "Get whether the specified environment toggle is accessed.")
    public AccessStatusResponse query(@PathVariable("projectKey") String projectKey,
                                      @PathVariable("environmentKey") String environmentKey,
                                      @PathVariable("toggleKey") String toggleKey,
                                      @RequestParam(value = "sdkType", required = false) SDKType sdkType) {
        return new AccessStatusResponse(trafficChartService.isAccess(projectKey, environmentKey, toggleKey, sdkType));
    }

}
