package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.SketchStatusEnum;
import com.featureprobe.api.dao.listener.TenantEntityListener;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
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

@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "targeting_sketch")
@DynamicInsert
@EntityListeners(TenantEntityListener.class)
@ToString(callSuper = true)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
public class TargetingSketch extends AbstractAuditEntity implements TenantSupport, Serializable {

    @Column(name = "approval_id")
    private Long approvalId;

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "project_key")
    private String projectKey;

    @Column(name = "environment_key")
    private String environmentKey;

    @Column(name = "toggle_key")
    private String toggleKey;

    @Column(name = "old_version")
    private Long oldVersion;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String comment;

    @Column(columnDefinition = "TINYINT")
    private Boolean disabled;

    @Enumerated(EnumType.STRING)
    private SketchStatusEnum status;

    public String uniqueKey() {
        return projectKey + "&" + environmentKey + "&" + toggleKey;
    }

}
