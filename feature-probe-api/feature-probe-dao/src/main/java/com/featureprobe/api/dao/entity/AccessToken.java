package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.AccessTokenType;
import com.featureprobe.api.base.enums.OrganizationRoleEnum;
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
import java.io.Serializable;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "access_token")
@ToString(callSuper = true)
@DynamicInsert
@EntityListeners(TenantEntityListener.class)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
@FilterDef(name = "deletedFilter", parameters = {@ParamDef(name = "deleted", type = "boolean")})
@Filter(name = "deletedFilter", condition = "deleted = :deleted")
public class AccessToken extends AbstractAuditEntity implements TenantSupport, Serializable {

    private String name;

    @Enumerated(EnumType.STRING)
    private OrganizationRoleEnum role;

    @Column(name = "member_id")
    private Long memberId;

    @Column(columnDefinition = "TINYINT")
    private boolean deleted;

    @Column(name = "organization_id")
    private Long organizationId;

    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "[type]")
    private AccessTokenType type;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "visited_time")
    private Date visitedTime;

}
