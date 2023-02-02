package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.EventMetricEnum;
import com.featureprobe.api.base.enums.EventTypeEnum;
import com.featureprobe.api.base.enums.MatcherTypeEnum;
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
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "event")
@DynamicInsert
@EntityListeners(TenantEntityListener.class)
@ToString(callSuper = true)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
public class Event extends AbstractAuditEntity implements TenantSupport, Serializable {

    @Column(name = "organization_id")
    private Long organizationId;

    @Enumerated(EnumType.STRING)
    private EventTypeEnum type;

    private String name;

    @Enumerated(EnumType.STRING)
    private EventMetricEnum metric;

    @Enumerated(EnumType.STRING)
    private MatcherTypeEnum matcher;

    private String url;

    private String selector;

}
