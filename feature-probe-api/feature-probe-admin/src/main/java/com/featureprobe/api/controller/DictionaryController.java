package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.dto.DictionaryResponse;
import com.featureprobe.api.service.DictionaryService;
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
@Tag(name = "Dictionary", description = "The dictionary api ")
public class DictionaryController {

    private DictionaryService dictionaryService;

    @GetMapping("/{key}")
    public DictionaryResponse query(@PathVariable("key") String key) {
        return dictionaryService.query(key);
    }

    @PostMapping("/{key}")
    public DictionaryResponse save(@PathVariable("key") String key,
                                   @RequestBody String value) {
        return dictionaryService.create(key, value);
    }

}
