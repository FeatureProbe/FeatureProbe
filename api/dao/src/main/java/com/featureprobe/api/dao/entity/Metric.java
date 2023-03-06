package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.AlgorithmDenominatorEnum;
import com.featureprobe.api.base.enums.MetricTypeEnum;
import com.featureprobe.api.base.enums.WinCriteria;
import com.featureprobe.api.dao.listener.TenantEntityListener;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "metric")
@DynamicInsert
@EntityListeners(TenantEntityListener.class)
@ToString(callSuper = true)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
public class Metric  extends AbstractAuditEntity implements TenantSupport {

    @Column(name = "organization_id")
    private Long organizationId;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String unit;

    @Column(name = "win_criteria")
    @Enumerated(EnumType.STRING)
    private WinCriteria winCriteria;

    @Enumerated(EnumType.STRING)
    private AlgorithmDenominatorEnum denominator;

    @Enumerated(EnumType.STRING)
    private MetricTypeEnum type;

    @Column(name = "project_key")
    private String projectKey;

    @Column(name = "environment_key")
    private String environmentKey;

    @Column(name = "toggle_key")
    private String toggleKey;

    @ManyToMany(cascade = {CascadeType.REFRESH}, fetch = FetchType.EAGER)
    @JoinTable(
            name = "metric_event",
            joinColumns = {@JoinColumn(name = "metric_id", referencedColumnName = "id")},
            inverseJoinColumns = {@JoinColumn(name = "event_id", referencedColumnName = "id")}
    )
    private Set<Event> events;

    public Metric (MetricTypeEnum type, String projectKey, String environmentKey, String toggleKey,
                   Set<Event> events) {
        this.type = type;
        this.projectKey = projectKey;
        this.environmentKey = environmentKey;
        this.toggleKey = toggleKey;
        this.events = events;
    }

}
