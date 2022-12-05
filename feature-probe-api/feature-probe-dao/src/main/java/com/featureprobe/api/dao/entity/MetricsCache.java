package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.MetricsCacheTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "metrics_cache")
@DynamicInsert
@ToString(callSuper = true)
public class MetricsCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sdk_key")
    private String sdkKey;

    @Column(name = "toggle_key")
    private String toggleKey;

    @Column(columnDefinition = "TEXT")
    private String data;

    @Column(name = "start_date")
    private Date startDate;

    @Column(name = "end_date")
    private Date endDate;

    @Enumerated(EnumType.STRING)
    private MetricsCacheTypeEnum type;
}
