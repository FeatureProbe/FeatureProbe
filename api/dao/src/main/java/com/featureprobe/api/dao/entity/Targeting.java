package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.ToggleReleaseStatusEnum;
import com.featureprobe.api.dao.listener.TenantEntityListener;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "targeting")
@DynamicInsert
@ToString(callSuper = true)
@EntityListeners(TenantEntityListener.class)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
@FilterDef(name = "deletedFilter", parameters = {@ParamDef(name = "deleted", type = "boolean")})
@Filter(name = "deletedFilter", condition = "deleted = :deleted")
public class Targeting extends AbstractAuditEntity implements TenantSupport {

    @Column(name = "toggle_key")
    private String toggleKey;

    @Column(name = "environment_key")
    private String environmentKey;

    @Column(name = "project_key")
    private String projectKey;

    private Long version;

    @Column(columnDefinition = "BIT", length = 1)
    private boolean disabled;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "publish_time")
    private Date publishTime;

    @Column(columnDefinition = "BIT", length = 1)
    private boolean deleted;

    @Column(name = "organization_id")
    private Long organizationId;

    @Enumerated(EnumType.STRING)
    private ToggleReleaseStatusEnum status;

    public String uniqueKey() {
        return projectKey + "&" + environmentKey + "&" + toggleKey;
    }

}
