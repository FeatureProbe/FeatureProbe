package io.featureprobe.api.controller;

import io.featureprobe.api.base.doc.CreateApiResponse;
import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.DeleteApiResponse;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.base.enums.AccessTokenType;
import io.featureprobe.api.base.enums.ResponseCodeEnum;
import io.featureprobe.api.base.model.BaseResponse;
import io.featureprobe.api.dto.AccessTokenCreateRequest;
import io.featureprobe.api.dto.AccessTokenResponse;
import io.featureprobe.api.dto.AccessTokenSearchRequest;
import io.featureprobe.api.dto.TokenResponse;
import io.featureprobe.api.service.AccessTokenService;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@DefaultApiResponses
@RequestMapping("/api/tokens")
@AllArgsConstructor
@RestController
@ResourceExistsValidate
@Tag(name = "Access tokens", description = "The access tokens API allows you to list," +
        "create and delete access tokens programmatically.")
public class AccessTokenController {

    private AccessTokenService accessTokenService;

    @GetMapping
    @GetApiResponse
    @Operation(summary = "List access tokens", description = "Fetch a list of person or application access tokens.")
    public Page<AccessTokenResponse> list(AccessTokenSearchRequest searchRequest) {
        return accessTokenService.list(searchRequest);
    }

    @PostMapping
    @CreateApiResponse
    @Operation(summary = "Create access tokens", description = "Create a new access token.")
    public TokenResponse create(@RequestBody @Validated AccessTokenCreateRequest request) {
        return accessTokenService.create(request);
    }

    @GetMapping("/exists")
    @GetApiResponse
    @Operation(summary = "Check access token exist", description = "Check toggle exist.")
    public BaseResponse exists(
            @RequestParam("name")
            @Schema(description = "The name for the access token.")
            String name,
            @RequestParam("type")
            @Schema(description = "The type for the access token.")
            AccessTokenType type) {
        accessTokenService.validateExists(name, type);
        return new BaseResponse(ResponseCodeEnum.SUCCESS);
    }

    @GetMapping("/{id}")
    @GetApiResponse
    @Operation(summary = "Get access token", description = "Get a single access token by ID.")
    public AccessTokenResponse query(@PathVariable("id") @Schema(description = "The ID of the access token") Long id) {
        return accessTokenService.queryById(id);
    }

    @DeleteMapping("/{id}")
    @DeleteApiResponse
    @Operation(summary = "Delete access token", description = "Delete an access token by ID")
    public AccessTokenResponse delete(@PathVariable("id") @Schema(description = "The ID of the access token") Long id) {
        return accessTokenService.delete(id);
    }
}
