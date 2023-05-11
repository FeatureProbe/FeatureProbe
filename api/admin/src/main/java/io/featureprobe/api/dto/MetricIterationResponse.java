package io.featureprobe.api.dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class MetricIterationResponse {

    private Date start;

    private Date stop;

    private List<PublishRecord> records;

    @Data
    public static class PublishRecord {

        private Date publishTime;

        private Long version;

        private String releaseNote;

    }
}


