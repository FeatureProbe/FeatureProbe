package io.featureprobe.api.dao.entity;

import io.featureprobe.api.base.enums.EventTypeEnum;
import io.featureprobe.api.base.enums.MatcherTypeEnum;
import io.featureprobe.api.dao.listener.TenantEntityListener;
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
public class Event extends AbstractAuditEntity implements TenantSupport, Comparable<Event> {

    @Column(name = "organization_id")
    private Long organizationId;

    private String name;

    @Enumerated(EnumType.STRING)
    private EventTypeEnum type;

    @Enumerated(EnumType.STRING)
    private MatcherTypeEnum matcher;

    @Column(columnDefinition = "TEXT")
    private String url;

    @Column(columnDefinition = "TEXT")
    private String selector;

    public Event(EventTypeEnum type, String name, MatcherTypeEnum matcher, String url) {
        this.type = type;
        this.name = name;
        this.matcher = matcher;
        this.url = url;
    }

    public Event(EventTypeEnum type, String name, MatcherTypeEnum matcher, String url, String selector) {
        this.type = type;
        this.name = name;
        this.matcher = matcher;
        this.url = url;
        this.selector = selector;
    }


    @Override
    public int compareTo(Event o) {
        if (this.name.equals(o.name)) {
            return 0;
        }
        return -1;
    }
}
