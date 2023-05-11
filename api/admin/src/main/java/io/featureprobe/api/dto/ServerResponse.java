package io.featureprobe.api.dto;

import io.featureprobe.api.base.model.JSEvent;
import com.featureprobe.sdk.server.model.Segment;
import com.featureprobe.sdk.server.model.Toggle;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
public class ServerResponse {

    private Long version;

    private Long debugUntilTime;
    private Map<String, Toggle> toggles;
    private Map<String, Segment> segments;

    private Map<String, JSEvent> events;

    public ServerResponse(List<Toggle> toggleMessages, List<Segment> segmentMessages, List<JSEvent> eventMassages,
                          Long version, Long debugUntilTime) {
        toggles = toggleMessages.stream().collect(Collectors.toMap(Toggle::getKey, Function.identity()));
        segments = segmentMessages.stream().collect(Collectors.toMap(Segment::getUniqueId, Function.identity()));
        events = eventMassages.stream().collect(Collectors.toMap(JSEvent::getName, Function.identity()));
        this.version = version;
        this.debugUntilTime = debugUntilTime;
    }

}
