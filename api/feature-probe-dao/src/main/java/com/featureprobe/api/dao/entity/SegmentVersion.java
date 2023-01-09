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

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "segment_version")
@DynamicInsert
@ToString(callSuper = true)
@EntityListeners(TenantEntityListener.class)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
public class SegmentVersion extends AbstractAuditEntity implements TenantSupport {

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "project_key")
    private String projectKey;

    @Column(name = "[key]")
    private String key;

    private String comment;

    @Column(columnDefinition = "TEXT")
    private String rules;

    private Long version;

    @Column(name = "approval_id")
    private Long approvalId;

}
