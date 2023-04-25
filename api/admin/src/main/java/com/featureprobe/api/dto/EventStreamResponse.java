package com.featureprobe.api.dto;

import com.featureprobe.sdk.server.Event;
import lombok.Data;
import java.util.Collections;
import java.util.List;

@Data
public class EventStreamResponse {

    private String projectKey;

    private String environmentKey;

    private boolean debuggerEnabled;

    private Long debugUntilTime;

    private List<Object> events = Collections.emptyList();

}
