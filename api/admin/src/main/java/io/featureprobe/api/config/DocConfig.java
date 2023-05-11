package io.featureprobe.api.config;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.apache.commons.lang3.StringUtils;
import org.springdoc.core.customizers.OpenApiCustomiser;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;


@Configuration
public class DocConfig {

    @Bean
    public OpenApiCustomiser sortTagsAlphabetically() {
        return openApi -> openApi.info(info())
                .setTags(openApi.getTags()
                        .stream()
                        .sorted(Comparator.comparing(tag -> StringUtils.stripAccents(tag.getName())))
                        .collect(Collectors.toList()));
    }

    private Info info() {
        Map extension = new HashMap();
        Map logo = new HashMap();
        logo.put("url", "https://featureprobe.io/static/media/logo.42399df7b492737767ddca38fb44a5a0.svg");
        extension.put("x-logo", logo);
        return new Info().title("FeatureProbe REST API")
                .description("**All REST API resources are authenticated with either personal or" +
                        "application access tokens. Other authentication mechanisms are not supported." +
                        "You can manage personal access tokens on your Account settings page.** <br/>")
                .contact(new Contact().name("FeatureProbe Technical Support Team").email("support@featureprobe.com")
                        .url("https://github.com/FeatureProbe/FeatureProbe#-community-and-sharing"))
                .version("1.0.0")
                .extensions(extension)
                .license(new License().name("Apache 2.0")
                        .url("https://github.com/FeatureProbe/FeatureProbe/blob/main/LICENSE"));
    }

}


