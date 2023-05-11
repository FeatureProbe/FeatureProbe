package io.featureprobe.api.controller;

import io.featureprobe.api.base.doc.CreateApiResponse;
import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.DeleteApiResponse;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.base.doc.PatchApiResponse;
import io.featureprobe.api.base.hook.Action;
import io.featureprobe.api.base.hook.Hook;
import io.featureprobe.api.base.hook.Resource;
import io.featureprobe.api.dto.SecretKeyResponse;
import io.featureprobe.api.dto.WebHookCreateRequest;
import io.featureprobe.api.dto.WebHookItemResponse;
import io.featureprobe.api.dto.WebHookListRequest;
import io.featureprobe.api.dto.WebHookResponse;
import io.featureprobe.api.dto.WebHookUpdateRequest;
import io.featureprobe.api.service.WebHookService;
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

import java.util.List;

@Slf4j
@Tag(name = "Webhooks", description = "The webhooks API allows you to list, create, modify, \" +\n" +
        "        \"query and delete WebHook programmatically.")
@RequestMapping("/api/webhooks")
@DefaultApiResponses
@AllArgsConstructor
@ResourceExistsValidate
@RestController
public class WebHookController {

    private WebHookService webHookService;

    @CreateApiResponse
    @PostMapping
    @Operation(summary = "Create webhook", description = "Create a new webhook.")
    @Hook(resource = Resource.WEBHOOK, action = Action.CREATE)
    public WebHookResponse create(@Validated @RequestBody WebHookCreateRequest createRequest) {
        return webHookService.create(createRequest);
    }

    @PatchApiResponse
    @PatchMapping("/{id}")
    @Operation(summary = "Update webhook", description = "Update a webhook.")
    @Hook(resource = Resource.WEBHOOK, action = Action.UPDATE)
    public WebHookResponse update(
            @PathVariable(name = "id") Long id,
            @Validated @RequestBody WebHookUpdateRequest updateRequest) {
        return webHookService.update(id, updateRequest);
    }

    @DeleteApiResponse
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete webhook", description = "Delete a webhook.")
    @Hook(resource = Resource.WEBHOOK, action = Action.DELETE)
    public WebHookResponse delete(@PathVariable(name = "id") @Schema(description = "The ID of the webhook.")
                                      Long id) {
        return webHookService.delete(id);
    }

    @GetApiResponse
    @GetMapping("/{id}")
    @Operation(summary = "Get WebHook", description = "Get a single webhook flag by id.")
    public WebHookItemResponse query(@PathVariable(name = "id") @Schema(description = "The ID of the webhook.")
                                         Long id) {
        return webHookService.query(id);
    }

    @GetApiResponse
    @GetMapping("/secretKey")
    @Operation(summary = "Get WebHook SecretKey", description = "Get a system-suggested secret key.")
    public SecretKeyResponse secretKey() {
        return webHookService.secretKey();
    }

    @GetApiResponse
    @GetMapping
    @Operation(summary = "List WebHook", description = "Get a list of all WebHook.")
    public Page<WebHookItemResponse> list(@Validated WebHookListRequest listRequest) {
        return webHookService.list(listRequest);
    }

    @GetApiResponse
    @GetMapping("/checkUrl")
    @Operation(summary = "Get webhook names", description = "Get the webhook names of the same url.")
    public List<String> queryByUrl(@RequestParam(name = "url") @Schema(description = "The url of the webhook.")
                                       String url) {
        return webHookService.queryByUrl(url);
    }

}
