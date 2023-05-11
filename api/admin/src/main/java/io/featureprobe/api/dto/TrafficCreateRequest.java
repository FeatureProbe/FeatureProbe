package io.featureprobe.api.dto;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class TrafficCreateRequest {

    AccessSummaryRequest access;

    List<Map> events;

}
