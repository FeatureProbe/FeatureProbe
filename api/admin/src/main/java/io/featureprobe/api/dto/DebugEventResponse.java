package io.featureprobe.api.dto;

import lombok.Data;

import javax.persistence.Column;
import java.util.Map;

@Data
public class DebugEventResponse {

    private String kind;

    private Long time;

    private String toggleKey;

    private Integer variationIndex;

    private Integer ruleIndex;

    private Integer version;

    private String userKey;

    private Map userDetail;

    private String value;

    private String reason;

    private String sdkType;

    private String sdkVersion;

}
