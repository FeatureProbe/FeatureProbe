package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.ApprovalStatusEnum;
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
@Table(name = "approval_record")
@DynamicInsert
@EntityListeners(TenantEntityListener.class)
@ToString(callSuper = true)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
public class ApprovalRecord extends AbstractAuditEntity implements TenantSupport, Serializable {

    @Column(name = "organization_id")
    private Long organizationId;

    @Column(name = "project_key")
    private String projectKey;

    @Column(name = "environment_key")
    private String environmentKey;

    @Column(name = "toggle_key")
    private String toggleKey;

    private String submitBy;

    private String approvedBy;

    @Column(name = "reviewers")
    private String reviewers;

    @Enumerated(EnumType.STRING)
    private ApprovalStatusEnum status;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String comment;

    public String environmentUniqueKey() {
        return projectKey + "&" + environmentKey;
    }

    public String toggleUniqueKey() {
        return projectKey + "&" + toggleKey;
    }

}
