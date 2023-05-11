package io.featureprobe.api.controller;

import io.featureprobe.api.base.doc.CreateApiResponse;
import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.base.doc.ProjectKeyParameter;
import io.featureprobe.api.dto.AttributeRequest;
import io.featureprobe.api.dto.AttributeResponse;
import io.featureprobe.api.service.AttributeService;
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
@DefaultApiResponses
@Tag(name = "Attributes", description = "The attribute used for targeting rule configuration.")
@RequestMapping("/api/projects/{projectKey}/attributes")
@ProjectKeyParameter
@AllArgsConstructor
@RestController
@ResourceExistsValidate
public class AttributeController {

    private AttributeService attributeService;

    @CreateApiResponse
    @PostMapping
    @Operation(summary = "Create attribute", description = "Create a new attribute.")
    public AttributeResponse create(
            @PathVariable("projectKey") String projectKey,
            @RequestBody @Validated AttributeRequest attributeRequest) {
        return attributeService.create(projectKey, attributeRequest);
    }

    @GetApiResponse
    @GetMapping
    @Operation(summary = "List attributes", description = "List all attributes in the project.")
    public List<String> list(
            @PathVariable("projectKey") String projectKey) {
        return attributeService.queryByProjectKey(projectKey);
    }

}
