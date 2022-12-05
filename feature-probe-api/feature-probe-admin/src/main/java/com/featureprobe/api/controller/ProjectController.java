package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.CreateApiResponse;
import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.DeleteApiResponse;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.base.doc.PatchApiResponse;
import com.featureprobe.api.base.doc.ProjectKeyParameter;
import com.featureprobe.api.base.hook.Action;
import com.featureprobe.api.base.hook.Resource;
import com.featureprobe.api.base.hook.Hook;
import com.featureprobe.api.dto.ApprovalSettings;
import com.featureprobe.api.dto.PreferenceCreateRequest;
import com.featureprobe.api.dto.ProjectCreateRequest;
import com.featureprobe.api.dto.ProjectQueryRequest;
import com.featureprobe.api.dto.ProjectResponse;
import com.featureprobe.api.dto.ProjectUpdateRequest;
import com.featureprobe.api.base.enums.ResponseCodeEnum;
import com.featureprobe.api.base.enums.ValidateTypeEnum;
import com.featureprobe.api.base.model.BaseResponse;
import com.featureprobe.api.service.ProjectService;
import com.featureprobe.api.validate.ResourceExistsValidate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/projects")
@DefaultApiResponses
@ProjectKeyParameter
@ResourceExistsValidate
@Tag(name = "Project", description = "Using the projects API, you can create, destroy, and manage projects")
public class ProjectController {

    private ProjectService projectService;

    @PostMapping
    @CreateApiResponse
    @Operation(summary = "Create project", description = "Create a new project.")
    @Hook(resource = Resource.PROJECT, action = Action.CREATE)
    public ProjectResponse create(@RequestBody @Validated ProjectCreateRequest createRequest) {
        return projectService.create(createRequest);
    }

    @PatchMapping("/{projectKey}")
    @PatchApiResponse
    @Operation(summary = "Update project", description = "Update a project.")
    @Hook(resource = Resource.PROJECT, action = Action.UPDATE)
    public ProjectResponse update(@PathVariable("projectKey") String projectKey,
                                  @RequestBody @Validated ProjectUpdateRequest updateRequest) {
        return projectService.update(projectKey, updateRequest);
    }

    @DeleteMapping("/{projectKey}")
    @DeleteApiResponse
    @Operation(summary = "Delete project", description = "Delete a project.")
    @Hook(resource = Resource.PROJECT, action = Action.DELETE)
    public ProjectResponse delete(@PathVariable("projectKey") String projectKey) {
        return projectService.delete(projectKey);
    }

    @GetMapping
    @GetApiResponse
    @Operation(summary = "List projects", description = "Get a list of all project")
    public List<ProjectResponse> list(ProjectQueryRequest queryRequest) {
        return projectService.list(queryRequest);
    }

    @GetMapping("/{projectKey}")
    @GetApiResponse
    @Operation(summary = "Query project", description = "Get a single project by key")
    public ProjectResponse query(
            @PathVariable("projectKey") String projectKey) {
        return projectService.queryByKey(projectKey);
    }

    @GetMapping("/exists")
    @GetApiResponse
    @Operation(summary = "Check project exist", description = "Check project exist")
    public BaseResponse exists(
            @RequestParam ValidateTypeEnum type,
            @RequestParam String value) {
        projectService.validateExists(type, value);
        return new BaseResponse(ResponseCodeEnum.SUCCESS);
    }

    @PatchMapping("/{projectKey}/approvalSettings")
    @PatchApiResponse
    @Operation(summary = "Update project approval settings", description = "Update a project approval settings.")
    @Hook(resource = Resource.PROJECT, action = Action.UPDATE_APPROVAL_SETTINGS)
    public List<ApprovalSettings> updateApprovalSettings(@PathVariable("projectKey") String projectKey,
                                   @RequestBody @Validated PreferenceCreateRequest createRequest) {
        return projectService.updateApprovalSettings(projectKey, createRequest);
    }

    @GetMapping("/{projectKey}/approvalSettings")
    @GetApiResponse
    @Operation(summary = "Query project settings", description = "Query a project settings.")
    public List<ApprovalSettings> approvalSettingsList(@PathVariable("projectKey") String projectKey) {
        return projectService.approvalSettingsList(projectKey);
    }

}
