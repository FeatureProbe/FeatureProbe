package com.featureprobe.api.controller;

import com.featureprobe.api.base.doc.CreateApiResponse;
import com.featureprobe.api.base.doc.DefaultApiResponses;
import com.featureprobe.api.base.doc.EnvironmentKeyParameter;
import com.featureprobe.api.base.doc.GetApiResponse;
import com.featureprobe.api.base.doc.ProjectKeyParameter;
import com.featureprobe.api.base.doc.ToggleKeyParameter;
import com.featureprobe.api.dto.EventCreateRequest;
import com.featureprobe.api.dto.EventResponse;
import com.featureprobe.api.service.EventService;
import com.featureprobe.api.validate.ResourceExistsValidate;
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

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/projects/{projectKey}/environments/{environmentKey}/toggles/{toggleKey}/events")
@DefaultApiResponses
@ProjectKeyParameter
@EnvironmentKeyParameter
@ToggleKeyParameter
@ResourceExistsValidate
@Tag(name = "Events", description = "The events API allows you to create, " +
        "update and query event programmatically.")
public class EventController {

    private EventService eventService;

    @PostMapping
    @CreateApiResponse
    @Operation(summary = "Create or Update event",
            description = "Create a new event or Update a exists event.")
    public EventResponse create(@PathVariable("projectKey") String projectKey,
                                @PathVariable("environmentKey") String environmentKey,
                                @PathVariable("toggleKey") String toggleKey,
                                @RequestBody @Validated EventCreateRequest request) {
        return eventService.create(projectKey, environmentKey, toggleKey, request);
    }

    @GetMapping
    @GetApiResponse
    @Operation(summary = "Get event", description = "Get a single event by toggle.")
    public EventResponse query(@PathVariable("projectKey") String projectKey,
                               @PathVariable("environmentKey") String environmentKey,
                               @PathVariable("toggleKey") String toggleKey) {
        return eventService.query(projectKey, environmentKey, toggleKey);
    }

}
