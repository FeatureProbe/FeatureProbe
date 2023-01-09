package com.featureprobe.api.dao.entity;

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
import javax.persistence.Table;
import javax.persistence.Version;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "segment")
@DynamicInsert
@ToString(callSuper = true)
@EntityListeners(TenantEntityListener.class)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
@FilterDef(name = "deletedFilter", parameters = {@ParamDef(name = "deleted", type = "boolean")})
@Filter(name = "deletedFilter", condition = "deleted = :deleted")
public class Segment extends AbstractAuditEntity implements TenantSupport {

    private String name;

    @Column(name = "[key]")
    private String key;

    @Column(name = "unique_Key")
    private String uniqueKey;

    private String description;

    @Column(name = "project_key")
    private String projectKey;

    @Version
    private Long version;

    @Column(columnDefinition = "TEXT")
    private String rules;

    @Column(columnDefinition = "TINYINT")
    private boolean deleted;

    @Column(name = "organization_id")
    private Long organizationId;

    public String uniqueKey() {
        return projectKey + "&" + key;
    }

}
