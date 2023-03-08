package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.CreateApiResponse;
import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.EnvironmentKeyParameter;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.base.doc.ProjectKeyParameter;
import com.featureprobe.api.base.doc.ToggleKeyParameter;
import com.featureprobe.api.dto.AnalysisRequest;
import com.featureprobe.api.dto.AnalysisResultResponse;
import com.featureprobe.api.dto.MetricConfigResponse;
import com.featureprobe.api.dto.MetricCreateRequest;
import com.featureprobe.api.dto.MetricIterationResponse;
import com.featureprobe.api.dto.MetricResponse;
import com.featureprobe.api.dto.MetricStatusResponse;
import com.featureprobe.api.service.MetricService;
import com.featureprobe.api.validate.ResourceExistsValidate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/projects/{projectKey}/environments/{environmentKey}/toggles/{toggleKey}/metric")
@DefaultApiResponses
@ProjectKeyParameter
@EnvironmentKeyParameter
@ToggleKeyParameter
@ResourceExistsValidate
@Tag(name = "Metric", description = "The metric API allows you to create, " +
        "update and query metric programmatically.")
public class MetricController {

    private MetricService metricService;

    @PostMapping
    @CreateApiResponse
    @Operation(summary = "Create or Update metric",
            description = "Create a new metric or Update a exists metric.")
    public MetricResponse create(@PathVariable("projectKey") String projectKey,
                                 @PathVariable("environmentKey") String environmentKey,
                                 @PathVariable("toggleKey") String toggleKey,
                                 @RequestBody @Validated MetricCreateRequest request) {
        return metricService.create(projectKey, environmentKey, toggleKey, request);
    }

    @GetMapping
    @GetApiResponse
    @Operation(summary = "Get Metric", description = "Get a single metric by toggle.")
    public MetricConfigResponse query(@PathVariable("projectKey") String projectKey,
                                      @PathVariable("environmentKey") String environmentKey,
                                      @PathVariable("toggleKey") String toggleKey) {
        return metricService.query(projectKey, environmentKey, toggleKey);
    }

    @GetMapping("/analysis")
    @GetApiResponse
    @Operation(summary = "Get Metric", description = "Get a single metric by toggle.")
    public AnalysisResultResponse analysis(@PathVariable("projectKey") String projectKey,
                                           @PathVariable("environmentKey") String environmentKey,
                                           @PathVariable("toggleKey") String toggleKey,
                                           AnalysisRequest params) {
        return metricService.analysis(projectKey, environmentKey, toggleKey, params);
    }

    @GetMapping("/iterations")
    @GetApiResponse
    @Operation(summary = "Get Iteration", description = "Get a single metric iteration by toggle.")
    public List<MetricIterationResponse> iteration(@PathVariable("projectKey") String projectKey,
                                                   @PathVariable("environmentKey") String environmentKey,
                                                   @PathVariable("toggleKey") String toggleKey) {
        return metricService.iteration(projectKey, environmentKey, toggleKey);
    }


    @GetApiResponse
    @GetMapping("/status")
    @Operation(summary = "Get metric status",
            description = "Get whether the specified environment toggle is report metric data.")
    public MetricStatusResponse status(@PathVariable("projectKey") String projectKey,
                                       @PathVariable("environmentKey") String environmentKey,
                                       @PathVariable("toggleKey") String toggleKey) {
        return new MetricStatusResponse(metricService.isReport(projectKey, environmentKey, toggleKey));
    }
}
