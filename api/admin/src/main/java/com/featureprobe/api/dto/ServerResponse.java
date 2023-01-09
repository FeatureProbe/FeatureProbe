package com.featureprobe.api.dto;

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
    private Map<String, Toggle> toggles;
    private Map<String, Segment> segments;

    public ServerResponse(List<Toggle> toggleMessages, List<Segment> segmentMessages, Long version) {
        toggles = toggleMessages.stream().collect(Collectors.toMap(Toggle::getKey, Function.identity()));
        segments = segmentMessages.stream().collect(Collectors.toMap(Segment::getUniqueId, Function.identity()));
        this.version = version;
    }

}
