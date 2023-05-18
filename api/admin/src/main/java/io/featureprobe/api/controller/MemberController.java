package io.featureprobe.api.controller;

import io.featureprobe.api.auth.TokenHelper;
import io.featureprobe.api.base.doc.CreateApiResponse;
import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.DeleteApiResponse;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.base.doc.PatchApiResponse;
import io.featureprobe.api.base.hook.Action;
import io.featureprobe.api.base.hook.Hook;
import io.featureprobe.api.base.hook.Resource;
import io.featureprobe.api.base.tenant.TenantContext;
import io.featureprobe.api.dto.MemberCreateRequest;
import io.featureprobe.api.dto.MemberDeleteRequest;
import io.featureprobe.api.dto.MemberModifyPasswordRequest;
import io.featureprobe.api.dto.MemberItemResponse;
import io.featureprobe.api.dto.MemberResponse;
import io.featureprobe.api.dto.MemberSearchRequest;
import io.featureprobe.api.dto.MemberUpdateRequest;
import io.featureprobe.api.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/members")
@DefaultApiResponses
@Tag(name = "Members", description = "The members API allows you to list, create, modify, query" +
        " and delete member programmatically.")
public class MemberController {

    private MemberService memberService;


    @GetApiResponse
    @GetMapping("/current")
    @Operation(summary = "Get login member", description = "Get current login member.")
    @PreAuthorize("hasAnyAuthority('OWNER', 'WRITER')")
    public MemberItemResponse currentLoginMember() {
        MemberItemResponse response = new MemberItemResponse(TokenHelper.getAccount(), TokenHelper.getRole());
        response.setOrganizationName(TenantContext.getCurrentOrganization().getOrganizationName());
        response.setOrganizationId(TenantContext.getCurrentOrganization().getOrganizationId());
        return response;
    }

    @CreateApiResponse
    @PostMapping
    @Operation(summary = "Create multiple member", description = "Create multiple new member.")
    @PreAuthorize("hasAuthority('OWNER')")
    @Hook(resource = Resource.MEMBER, action = Action.CREATE)
    public List<MemberResponse> create(@Validated @RequestBody MemberCreateRequest createRequest) {
        return memberService.create(createRequest);
    }

    @GetApiResponse
    @GetMapping
    @Operation(summary = "List members", description = "Fetch a list of members.")
    @PreAuthorize("hasAnyAuthority('OWNER', 'WRITER')")
    public Page<MemberItemResponse> list(MemberSearchRequest searchRequest) {
        return memberService.list(searchRequest);
    }

    @PatchApiResponse
    @PatchMapping
    @Operation(summary = "Update member", description = "Update a member.")
    @PreAuthorize("hasAuthority('OWNER')")
    @Hook(resource = Resource.MEMBER, action = Action.UPDATE)
    public MemberResponse update(@Validated @RequestBody MemberUpdateRequest updateRequest) {
        return memberService.update(updateRequest);
    }

    @PatchApiResponse
    @PatchMapping("/modifyPassword")
    @Operation(summary = "Modify member password", description = "Modify a member password.")
    public MemberItemResponse modifyPassword(
            @Validated @RequestBody MemberModifyPasswordRequest modifyPasswordRequest) {
        return memberService.modifyPassword(modifyPasswordRequest);
    }

    @DeleteApiResponse
    @DeleteMapping
    @Operation(summary = "Delete member", description = "Logical delete a member.")
    @PreAuthorize("hasAuthority('OWNER')")
    @Hook(resource = Resource.MEMBER, action = Action.DELETE)
    public MemberResponse delete(@Validated @RequestBody MemberDeleteRequest deleteRequest) {
        return memberService.delete(deleteRequest.getAccount());
    }

    @GetApiResponse
    @GetMapping("/query")
    @Operation(summary = "Get member", description = "Get a single member by account.")
    public MemberItemResponse query(@Schema(description = "A system-unique account used to reference the member.")
                                        String account) {
        return memberService.queryByAccount(account);
    }
}
