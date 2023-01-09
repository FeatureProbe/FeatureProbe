package com.featureprobe.api.controller;

import com.featureprobe.api.auth.TokenHelper;
import com.featureprobe.api.base.doc.CreateApiResponse;
import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.DeleteApiResponse;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.base.doc.PatchApiResponse;
import com.featureprobe.api.base.hook.Action;
import com.featureprobe.api.base.hook.Hook;
import com.featureprobe.api.base.hook.Resource;
import com.featureprobe.api.dto.MemberCreateRequest;
import com.featureprobe.api.dto.MemberDeleteRequest;
import com.featureprobe.api.dto.MemberModifyPasswordRequest;
import com.featureprobe.api.dto.MemberItemResponse;
import com.featureprobe.api.dto.MemberResponse;
import com.featureprobe.api.dto.MemberSearchRequest;
import com.featureprobe.api.dto.MemberUpdateRequest;
import com.featureprobe.api.service.MemberService;
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
        return new MemberItemResponse(TokenHelper.getAccount(), TokenHelper.getRole());
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
