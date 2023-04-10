package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.CreateApiResponse;
import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.EnvironmentKeyParameter;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.base.doc.PatchApiResponse;
import com.featureprobe.api.base.doc.ProjectKeyParameter;
import com.featureprobe.api.base.doc.ToggleKeyParameter;
import com.featureprobe.api.base.hook.Action;
import com.featureprobe.api.base.hook.Hook;
import com.featureprobe.api.base.hook.Resource;
import com.featureprobe.api.dto.AfterTargetingVersionResponse;
import com.featureprobe.api.dto.ApprovalResponse;
import com.featureprobe.api.dto.CancelSketchRequest;
import com.featureprobe.api.dto.DependentToggleRequest;
import com.featureprobe.api.dto.DependentToggleResponse;
import com.featureprobe.api.dto.PrerequisiteToggleRequest;
import com.featureprobe.api.dto.PrerequisiteToggleResponse;
import com.featureprobe.api.dto.TargetingApprovalRequest;
import com.featureprobe.api.dto.TargetingDiffResponse;
import com.featureprobe.api.dto.TargetingPublishRequest;
import com.featureprobe.api.dto.TargetingResponse;
import com.featureprobe.api.dto.TargetingVersionRequest;
import com.featureprobe.api.dto.TargetingVersionResponse;
import com.featureprobe.api.dto.ToggleControlConfRequest;
import com.featureprobe.api.dto.UpdateApprovalStatusRequest;
import com.featureprobe.api.service.TargetingService;
import com.featureprobe.api.validate.ResourceExistsValidate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@Slf4j
@Tag(name = "Targeting", description = "The Targeting API allows you to publish ,query and approval programmatically.")
@RequestMapping("/api/projects/{projectKey}/environments/{environmentKey}/toggles/{toggleKey}/targeting")
@ProjectKeyParameter
@EnvironmentKeyParameter
@ToggleKeyParameter
@DefaultApiResponses
@AllArgsConstructor
@RestController
@ResourceExistsValidate
public class TargetingController {

    private TargetingService targetingService;

    @PatchApiResponse
    @PatchMapping
    @Operation(summary = "Publish targeting", description = "Publish the targeting " +
            "by projectKey， environmentKey and toggleKey.")
    @Hook(resource = Resource.TOGGLE, action = Action.PUBLISH)
    public TargetingResponse publish(
            @PathVariable("projectKey") String projectKey,
            @PathVariable("environmentKey") String environmentKey,
            @PathVariable("toggleKey") String toggleKey,
            @RequestBody @Validated TargetingPublishRequest targetingPublishRequest) {
        return targetingService.publish(projectKey, environmentKey, toggleKey, targetingPublishRequest);
    }

    @CreateApiResponse
    @PostMapping("/approval")
    @Operation(summary = "Submit targeting approval", description = "Submit the targeting change approval.")
    @Hook(resource = Resource.TOGGLE, action = Action.CREATE_APPROVAL)
    public ApprovalResponse approval(
            @PathVariable("projectKey") String projectKey,
            @PathVariable("environmentKey") String environmentKey,
            @PathVariable("toggleKey") String toggleKey,
            @RequestBody @Validated TargetingApprovalRequest approvalRequest) {
        return targetingService.approval(projectKey, environmentKey, toggleKey, approvalRequest);
    }


    @PatchMapping("/sketch/publish")
    @CreateApiResponse
    @Operation(summary = "Publish targeting sketch", description = "Publish targeting sketch.")
    @Hook(resource = Resource.TOGGLE, action = Action.PUBLISH)
    public TargetingResponse publishSketch(@PathVariable("projectKey") String projectKey,
                                           @PathVariable("environmentKey") String environmentKey,
                                           @PathVariable("toggleKey") String toggleKey,
                                           @RequestBody(required = false) @Validated
                                                       ToggleControlConfRequest controlConfRequest) {
        return targetingService.publishSketch(projectKey, environmentKey, toggleKey, controlConfRequest);
    }

    @PatchMapping("/sketch/cancel")
    @CreateApiResponse
    @Operation(summary = "Abandon targeting sketch", description = "Abandon targeting sketch.")
    @Hook(resource = Resource.TOGGLE, action = Action.REVOKE_APPROVAL)
    public TargetingResponse cancelSketch(@PathVariable("projectKey") String projectKey,
                                     @PathVariable("environmentKey") String environmentKey,
                                     @PathVariable("toggleKey") String toggleKey,
                                     @RequestBody @Validated CancelSketchRequest cancelSketchRequest) {
        return targetingService.cancelSketch(projectKey, environmentKey, toggleKey, cancelSketchRequest);
    }


    @PatchApiResponse
    @PatchMapping("/approvalStatus")
    @Operation(summary = "Update targeting approval", description = "Update targeting approval status.")
    @Hook(resource = Resource.TOGGLE, action = Action.UPDATE_APPROVAL)
    public ApprovalResponse updateApprovalStatus(@PathVariable("projectKey") String projectKey,
                                             @PathVariable("environmentKey") String environmentKey,
                                             @PathVariable("toggleKey") String toggleKey,
                                             @RequestBody @Validated UpdateApprovalStatusRequest updateRequest) {
        return targetingService.updateApprovalStatus(projectKey, environmentKey, toggleKey, updateRequest);
    }

    @GetApiResponse
    @GetMapping
    @Operation(summary = "Get targeting", description = "Get a single targeting by projectKey ," +
            "environmentKey and toggleKey.")
    public TargetingResponse query(
            @PathVariable("projectKey") String projectKey,
            @PathVariable("environmentKey") String environmentKey,
            @PathVariable("toggleKey") String toggleKey) {
        return targetingService.queryByKey(projectKey, environmentKey, toggleKey);
    }

    @GetApiResponse
    @GetMapping("/versions")
    @Operation(summary = "List targeting version", description = "Get a list for all targeting version.")
    public Page<TargetingVersionResponse> versions(
            @PathVariable("projectKey") String projectKey,
            @PathVariable("environmentKey") String environmentKey,
            @PathVariable("toggleKey") String toggleKey,
            TargetingVersionRequest targetingVersionRequest) {
        return targetingService.queryVersions(projectKey, environmentKey, toggleKey, targetingVersionRequest);
    }

    @GetApiResponse
    @GetMapping("/versions/{version}")
    @Operation(summary = "List targeting version by version number",
            description = "Get all targeting historical versions larger than the version.")
    public AfterTargetingVersionResponse allAfterVersions(@PathVariable("projectKey") String projectKey,
                                                          @PathVariable("environmentKey") String environmentKey,
                                                          @PathVariable("toggleKey") String toggleKey,
                                                          @PathVariable("version")
                                                          @Schema(description = "Query all versions greater " +
                                                                  "than this version number")
                                                          Long version) {
        return targetingService.queryAfterVersion(projectKey, environmentKey, toggleKey, version);
    }

    @GetApiResponse
    @GetMapping("/diff")
    @Operation(summary = "Get targeting diff.", description = "Get current targeting and latest targeting sketch diff.")
    public TargetingDiffResponse diff(@PathVariable("projectKey") String projectKey,
                                      @PathVariable("environmentKey") String environmentKey,
                                      @PathVariable("toggleKey") String toggleKey) {
        return targetingService.diff(projectKey, environmentKey, toggleKey);
    }

    @GetApiResponse
    @GetMapping("/attributes")
    @Operation(summary = "Get targeting attributes.", description = "Get all user attributes used by the targeting.")
    public List<String> attributes(@PathVariable("projectKey") String projectKey,
                                   @PathVariable("environmentKey") String environmentKey,
                                   @PathVariable("toggleKey") String toggleKey) {
        return targetingService.attributes(projectKey, environmentKey, toggleKey);
    }


    @GetApiResponse
    @GetMapping("/prerequisite/toggles")
    @Operation(summary = "List available prerequisite toggles.",
            description = "List available prerequisite toggles.")
    public List<PrerequisiteToggleResponse> preToggles(@PathVariable("projectKey") String projectKey,
                                                       @PathVariable("environmentKey") String environmentKey,
                                                       @PathVariable("toggleKey") String toggleKey,
                                                       PrerequisiteToggleRequest query) {
        return targetingService.preToggles(projectKey, environmentKey, toggleKey, query);
    }

    @GetApiResponse
    @GetMapping("/prerequisite/dependencies")
    @Operation(summary = "List prerequisite dependent toggles.",
            description = "List prerequisite dependent toggles.")
    public Page<DependentToggleResponse> getDependentToggles(@PathVariable("projectKey") String projectKey,
                                                             @PathVariable("environmentKey") String environmentKey,
                                                             @PathVariable("toggleKey") String toggleKey,
                                                             DependentToggleRequest requestParam) {
        return targetingService.getDependentToggles(projectKey, environmentKey, toggleKey, requestParam);
    }


}
