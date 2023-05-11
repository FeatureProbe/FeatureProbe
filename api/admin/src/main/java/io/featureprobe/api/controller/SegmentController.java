package io.featureprobe.api.controller;

import io.featureprobe.api.base.doc.CreateApiResponse;
import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.DeleteApiResponse;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.base.doc.PatchApiResponse;
import io.featureprobe.api.base.doc.ProjectKeyParameter;
import io.featureprobe.api.base.doc.SegmentKeyParameter;
import io.featureprobe.api.base.hook.Action;
import io.featureprobe.api.base.hook.Hook;
import io.featureprobe.api.base.hook.Resource;
import io.featureprobe.api.dto.SegmentCreateRequest;
import io.featureprobe.api.dto.SegmentPublishRequest;
import io.featureprobe.api.dto.SegmentResponse;
import io.featureprobe.api.dto.SegmentSearchRequest;
import io.featureprobe.api.dto.SegmentUpdateRequest;
import io.featureprobe.api.dto.SegmentVersionRequest;
import io.featureprobe.api.dto.SegmentVersionResponse;
import io.featureprobe.api.dto.ToggleSegmentResponse;
import io.featureprobe.api.base.enums.ResponseCodeEnum;
import io.featureprobe.api.base.enums.ValidateTypeEnum;
import io.featureprobe.api.base.model.BaseResponse;
import io.featureprobe.api.base.model.PaginationRequest;
import io.featureprobe.api.service.SegmentService;
import io.featureprobe.api.validate.ResourceExistsValidate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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


@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/projects/{projectKey}/segments")
@DefaultApiResponses
@ResourceExistsValidate
@ProjectKeyParameter
@SegmentKeyParameter
@Tag(name = "Segments", description = "The segments API allows you to list, create, modify, query, " +
        "publish and delete segment programmatically.")
public class SegmentController {

    private SegmentService segmentService;

    @GetMapping
    @GetApiResponse
    @Operation(summary = "List segments", description = "Fetch a list of all segments in project.")
    public Page<SegmentResponse> list(@PathVariable(name = "projectKey") String projectKey,
                                      SegmentSearchRequest searchRequest) {
        return segmentService.list(projectKey, searchRequest);
    }

    @CreateApiResponse
    @PostMapping
    @Operation(summary = "Create segment", description = "Create a new segment.")
    @Hook(resource = Resource.SEGMENT, action = Action.CREATE)
    public SegmentResponse create(@PathVariable(name = "projectKey") String projectKey,
                                  @RequestBody @Validated SegmentCreateRequest createRequest) {
        return segmentService.create(projectKey, createRequest);
    }

    @PatchApiResponse
    @PatchMapping("/{segmentKey}")
    @Operation(summary = "Update segment", description = "Update a segment.")
    @Hook(resource = Resource.SEGMENT, action = Action.UPDATE)
    public SegmentResponse update(@PathVariable(name = "projectKey") String projectKey,
                                  @PathVariable(name = "segmentKey") String segmentKey,
                                  @RequestBody @Validated SegmentUpdateRequest segmentUpdateRequest) {
        return segmentService.update(projectKey, segmentKey, segmentUpdateRequest);
    }

    @PatchApiResponse
    @PatchMapping("/{segmentKey}/publish")
    @Operation(summary = "publish segment", description = "publish a segment.")
    @Hook(resource = Resource.SEGMENT, action = Action.PUBLISH)
    public SegmentResponse publish(@PathVariable(name = "projectKey") String projectKey,
                                  @PathVariable(name = "segmentKey") String segmentKey,
                                  @RequestBody @Validated SegmentPublishRequest publishRequest) {
        return segmentService.publish(projectKey, segmentKey, publishRequest);
    }

    @DeleteApiResponse
    @DeleteMapping("/{segmentKey}")
    @Operation(summary = "Delete segment", description = "Delete a segment.")
    @Hook(resource = Resource.SEGMENT, action = Action.DELETE)
    public SegmentResponse delete(@PathVariable(name = "projectKey") String projectKey,
                                  @PathVariable(name = "segmentKey") String segmentKey) {
        return segmentService.delete(projectKey, segmentKey);
    }


    @GetMapping("/{segmentKey}/toggles")
    @GetApiResponse
    @Operation(summary = "Using segment toggles", description = "List of toggles using segment.")
    public Page<ToggleSegmentResponse> usingToggles(@PathVariable(name = "projectKey") String projectKey,
                                                    @PathVariable(name = "segmentKey") String segmentKey,
                                                    PaginationRequest paginationRequest) {
        return segmentService.usingToggles(projectKey, segmentKey, paginationRequest);
    }


    @GetMapping("/{segmentKey}/versions")
    @GetApiResponse
    @Operation(summary = "List segment versions", description = "List historical versions of toggle.")
    public Page<SegmentVersionResponse> versions(@PathVariable(name = "projectKey") String projectKey,
                                                 @PathVariable(name = "segmentKey") String segmentKey,
                                                 SegmentVersionRequest versionRequest) {
        return segmentService.versions(projectKey, segmentKey, versionRequest);
    }

    @GetApiResponse
    @GetMapping("/{segmentKey}")
    @Operation(summary = "Get segment", description = "Get a single segment by key in project.")
    public SegmentResponse query(@PathVariable(name = "projectKey") String projectKey,
                                 @PathVariable(name = "segmentKey") String segmentKey) {
        return segmentService.queryByKey(projectKey, segmentKey);
    }

    @GetMapping("/exists")
    @GetApiResponse
    @Operation(summary = "Check segment exist", description = "Check segment exist.")
    public BaseResponse exists(@PathVariable("projectKey") String projectKey,
                               @RequestParam @Schema(description = "The type needs to be checked.")
                               ValidateTypeEnum type,
                               @RequestParam @Schema(description = "The attribute value to be checked.")
                               String value) {
        segmentService.validateExists(projectKey, type, value);
        return new BaseResponse(ResponseCodeEnum.SUCCESS);
    }


}
