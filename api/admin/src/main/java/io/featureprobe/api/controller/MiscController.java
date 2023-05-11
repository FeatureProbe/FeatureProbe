package io.featureprobe.api.controller;

import io.featureprobe.api.component.SdkVersionScheduler;
import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/misc")
@RestController
@Hidden
public class MiscController {

    @GetMapping("/sdk/{key}")
    public String querySdkVersion(@PathVariable("key") String key) {
        return String.format("\"%s\"", SdkVersionScheduler.latestVersions.get(key));
    }

}
