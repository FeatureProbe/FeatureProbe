package com.featureprobe.api.hook;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

@Data
@JsonPropertyOrder(alphabetic = true)
public class CallbackRequestBody {

    private String resource;

    private String action;

    private String operator;

    private Long timestamp;

    private String projectKey;

    private String environmentKey;

    private String toggleKey;

    private String segmentKey;

    private Object data;

}
