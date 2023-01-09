package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.hook.HookSettingsStatus;
import com.featureprobe.api.base.hook.CallbackType;
import com.featureprobe.api.dao.listener.TenantEntityListener;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "webhook_settings")
@DynamicInsert
@EqualsAndHashCode
@EntityListeners(TenantEntityListener.class)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
public class WebHookSettings extends AbstractAuditEntity implements TenantSupport {

    @Column(name = "organization_id")
    private Long organizationId;

    private String name;

    @Enumerated(EnumType.STRING)
    private HookSettingsStatus status;

    private String url;

    @Enumerated(EnumType.STRING)
    private CallbackType type;

    @Column(name = "secret_key")
    private String secretKey;

    private String description;

    @Column(name = "lasted_status")
    private String lastedStatus;

    @Column(name = "lasted_status_code")
    private Integer lastedStatusCode;

    @Column(name = "lasted_time")
    private Date lastedTime;

}
