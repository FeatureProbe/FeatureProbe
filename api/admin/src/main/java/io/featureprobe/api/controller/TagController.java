package io.featureprobe.api.controller;

import io.featureprobe.api.base.doc.CreateApiResponse;
import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.base.doc.ProjectKeyParameter;
import io.featureprobe.api.dto.TagRequest;
import io.featureprobe.api.dto.TagResponse;
import io.featureprobe.api.service.TagService;
import io.featureprobe.api.validate.ResourceExistsValidate;
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
@RestController
@DefaultApiResponses
@RequestMapping("/api/projects/{projectKey}/tags")
@Tag(name = "Tags", description = "The Tags API allows you to list and create tag programmatically.")
@ProjectKeyParameter
@AllArgsConstructor
@ResourceExistsValidate
public class TagController {

    private TagService tagService;

    @GetApiResponse
    @GetMapping
    @Operation(summary = "List tags", description = "Returns the list of the Tags in a specified Project.")
    public List<TagResponse> list(@PathVariable(name = "projectKey") String projectKey) {
        return tagService.queryByProjectKey(projectKey);
    }

    @CreateApiResponse
    @PostMapping
    @Operation(summary = "Create Tag", description = "Creates a new Tag in a specified Project.")
    public TagResponse create(@PathVariable(name = "projectKey") String projectKey,
                              @RequestBody @Validated TagRequest tagRequest) {
        return tagService.create(projectKey, tagRequest);
    }
}
