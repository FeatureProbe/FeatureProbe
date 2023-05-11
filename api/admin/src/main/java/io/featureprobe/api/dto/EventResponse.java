package io.featureprobe.api.dto;

import io.featureprobe.api.base.enums.EventTypeEnum;
import io.featureprobe.api.base.enums.MatcherTypeEnum;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class EventResponse {

    @Schema(description = "The name of the event. Use the event name in the code buried point. <br/> " +
            "Only contain letters, numbers, '.', '_' Or '-', and the length is greater than 4.")
    private String name;

    @Schema(description = "The type of the event.")
    private EventTypeEnum type;

    @Schema(description = "The URL matching pattern.")
    private MatcherTypeEnum matcher;

    @Schema(description = "The url of the event.")
    private String url;

    @Schema(description = "The css selector of the event.")
    private String selector;

}
