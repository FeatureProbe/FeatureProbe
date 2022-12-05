package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.CreateApiResponse;
import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.base.doc.PatchApiResponse;
import com.featureprobe.api.base.doc.ProjectKeyParameter;
import com.featureprobe.api.base.doc.ToggleKeyParameter;
import com.featureprobe.api.base.hook.Action;
import com.featureprobe.api.base.hook.Hook;
import com.featureprobe.api.base.hook.Resource;
import com.featureprobe.api.dto.EnvironmentResponse;
import com.featureprobe.api.dto.ToggleCreateRequest;
import com.featureprobe.api.dto.ToggleItemResponse;
import com.featureprobe.api.dto.ToggleResponse;
import com.featureprobe.api.dto.ToggleSearchRequest;
import com.featureprobe.api.dto.ToggleUpdateRequest;
import com.featureprobe.api.base.enums.ResponseCodeEnum;
import com.featureprobe.api.base.enums.ValidateTypeEnum;
import com.featureprobe.api.base.model.BaseResponse;
import com.featureprobe.api.service.IncludeArchivedToggleService;
import com.featureprobe.api.service.ToggleService;
import com.featureprobe.api.validate.ResourceExistsValidate;
import io.swagger.v3.oas.annotations.Operation;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@Tag(name = "Toggle", description = "The toggle is a collection of configurations")
@RequestMapping("/api/projects/{projectKey}/toggles")
@ProjectKeyParameter
@ToggleKeyParameter
@DefaultApiResponses
@AllArgsConstructor
@ResourceExistsValidate
@RestController
public class ToggleController {

    private ToggleService toggleService;

    private IncludeArchivedToggleService includeArchivedToggleService;

    @GetMapping
    @GetApiResponse
    @Operation(summary = "List toggles", description = "Get a list of all toggles in the project.")
    public Page<ToggleItemResponse> list(
            @PathVariable(name = "projectKey") String projectKey,
            @Validated ToggleSearchRequest filter) {
        return toggleService.list(projectKey, filter);
    }

    @CreateApiResponse
    @PostMapping
    @Operation(summary = "Create toggle", description = "Create a new toggle.")
    @Hook(resource = Resource.TOGGLE, action = Action.CREATE)
    public ToggleResponse create(
            @PathVariable(name = "projectKey") String projectKey,
            @RequestBody @Validated ToggleCreateRequest toggleCreateRequest) {
        includeArchivedToggleService.validateIncludeArchivedToggleByKey(projectKey, toggleCreateRequest.getKey());
        includeArchivedToggleService.validateIncludeArchivedToggleByName(projectKey, toggleCreateRequest.getName());
        return toggleService.create(projectKey, toggleCreateRequest);
    }

    @PatchApiResponse
    @PatchMapping("/{toggleKey}")
    @Operation(summary = "Update toggle", description = "Update a toggle.")
    @Hook(resource = Resource.TOGGLE, action = Action.UPDATE)
    public ToggleResponse update(@PathVariable(name = "projectKey") String projectKey,
                                 @PathVariable(name = "toggleKey") String toggleKey,
                                 @RequestBody @Validated ToggleUpdateRequest toggleUpdateRequest) {
        return toggleService.update(projectKey, toggleKey, toggleUpdateRequest);
    }


    @PatchMapping("/{toggleKey}/offline")
    @PatchApiResponse
    @Operation(summary = "Offline toggle", description = "Offline a toggle.")
    @Hook(resource = Resource.TOGGLE, action = Action.OFFLINE)
    public ToggleResponse offline(@PathVariable(name = "projectKey") String projectKey,
                                  @PathVariable(name = "toggleKey") String toggleKey) {
        return toggleService.offline(projectKey, toggleKey);
    }

    @PatchMapping("/{toggleKey}/restore")
    @PatchApiResponse
    @Operation(summary = "Restore toggle", description = "Restore a offline toggle.")
    @Hook(resource = Resource.TOGGLE, action = Action.RESTORE)
    public ToggleResponse restore(@PathVariable(name = "projectKey") String projectKey,
                                  @PathVariable(name = "toggleKey") String toggleKey) {
        return toggleService.restore(projectKey, toggleKey);
    }

    @GetApiResponse
    @GetMapping("/{toggleKey}")
    @Operation(summary = "Get toggle", description = "Get a single toggle by key.")
    public ToggleResponse query(@PathVariable(name = "projectKey") String projectKey,
                                @PathVariable(name = "toggleKey") String toggleKey) {
        return toggleService.queryByKey(projectKey, toggleKey);
    }

    @GetMapping("/exists")
    @GetApiResponse
    @Operation(summary = "Check toggle exist", description = "Check toggle exist")
    public BaseResponse checkKey(@PathVariable("projectKey") String projectKey,
                                 @RequestParam ValidateTypeEnum type,
                                 @RequestParam String value) {
        includeArchivedToggleService.validateIncludeArchivedToggle(projectKey, type, value);
        return new BaseResponse(ResponseCodeEnum.SUCCESS);
    }

}
