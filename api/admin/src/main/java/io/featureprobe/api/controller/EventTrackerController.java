package io.featureprobe.api.controller;

import io.featureprobe.api.base.doc.DefaultApiResponses;
import io.featureprobe.api.base.doc.EnvironmentKeyParameter;
import io.featureprobe.api.base.doc.GetApiResponse;
import io.featureprobe.api.base.doc.PatchApiResponse;
import io.featureprobe.api.base.doc.ProjectKeyParameter;
import io.featureprobe.api.base.model.BaseResponse;
import io.featureprobe.api.dto.EventStreamResponse;
import io.featureprobe.api.dto.EventTrackerStatusRequest;
import io.featureprobe.api.service.EventTrackerService;
import io.featureprobe.api.validate.ResourceExistsValidate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@AllArgsConstructor
@RestController
@RequestMapping("/api/projects/{projectKey}/environments/{environmentKey}/events")
@DefaultApiResponses
@ResourceExistsValidate
@ProjectKeyParameter
@EnvironmentKeyParameter
@Tag(name = "Event Tracker", description = "The event tracker API allows you to view live events.")
public class EventTrackerController {

    EventTrackerService eventTrackerService;

    @GetMapping
    @GetApiResponse
    @Operation(summary = "Get event stream", description = "Return a list of new events.")
    public EventStreamResponse getEventStream(@PathVariable("projectKey") String projectKey,
                                              @PathVariable("environmentKey") String environmentKey,
                                              @RequestParam(name = "uuid") String uuid) {
        return eventTrackerService.getEventStream(projectKey, environmentKey, uuid);
    }


    @PatchMapping("/tracker-status")
    @PatchApiResponse
    @Operation(summary = "Open event tracker", description = "Open event tracker.")
    public BaseResponse status(@PathVariable("projectKey") String projectKey,
                               @PathVariable("environmentKey") String environmentKey,
                               @RequestBody EventTrackerStatusRequest status) {
        return eventTrackerService.status(projectKey, environmentKey, status);
    }

}
