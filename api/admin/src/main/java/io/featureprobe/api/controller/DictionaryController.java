package io.featureprobe.api.controller;

import io.featureprobe.api.base.doc.CreateApiResponse;
import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.dto.DictionaryResponse;
import io.featureprobe.api.service.DictionaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/dictionaries")
@RestController
@DefaultApiResponses
@AllArgsConstructor
@Tag(name = "Dictionaries", description = "The dictionaries API allows you to query, " +
        "create dictionaries current login user programmatically.")
public class DictionaryController {

    private DictionaryService dictionaryService;

    @GetApiResponse
    @GetMapping("/{key}")
    @Operation(summary = "Get dictionary", description = "Get a single dictionary by key in current login user.")
    public DictionaryResponse query(
            @PathVariable("key")
            @Schema(description = "A unique key used to reference the dictionary in current login user.")
            String key) {
        return dictionaryService.query(key);
    }

    @CreateApiResponse
    @PostMapping("/{key}")
    @Operation(summary = "Create dictionary", description = "Create a new dictionary in current login user.")
    public DictionaryResponse save(
            @PathVariable("key")
            @Schema(description = "A unique key used to reference the dictionary in current login user.")
            String key,
            @RequestBody
            @Schema(name = "value", description = "The value of custom dictionary.")
            String value) {
        return dictionaryService.create(key, value);
    }

}
