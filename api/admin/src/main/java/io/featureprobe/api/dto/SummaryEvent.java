package io.featureprobe.api.dto;

import io.featureprobe.api.dao.entity.Traffic;
import lombok.Data;

import java.util.Date;

@Data
public class SummaryEvent {

    private String kind;

    private String toggleKey;

    private String sdkType;

    private String sdkVersion;

    private Long version;

    private Integer valueIndex;

    private Long count;

    private String value;

    private Date startDate;

    private Date endDate;


    public static SummaryEvent create(Traffic traffic) {
        SummaryEvent summaryEvent = new SummaryEvent();
        summaryEvent.setKind("summary");
        summaryEvent.setToggleKey(traffic.getToggleKey());
        summaryEvent.setSdkType(traffic.getSdkType());
        summaryEvent.setSdkVersion(traffic.getSdkVersion());
        summaryEvent.setVersion(traffic.getToggleVersion());
        summaryEvent.setValueIndex(traffic.getValueIndex());
        summaryEvent.setCount(traffic.getCount());
        summaryEvent.setStartDate(traffic.getStartDate());
        summaryEvent.setEndDate(traffic.getEndDate());
        summaryEvent.setValue(traffic.getValue());
        return summaryEvent;
    }

}
