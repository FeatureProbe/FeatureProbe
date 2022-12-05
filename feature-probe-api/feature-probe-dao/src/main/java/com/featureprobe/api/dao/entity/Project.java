package com.featureprobe.api.dao.entity;

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
import org.hibernate.annotations.Where;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.List;

@EqualsAndHashCode(exclude = "environments")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "project")
@DynamicInsert
@EntityListeners(TenantEntityListener.class)
@ToString(callSuper = true, exclude = "environments")
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
@FilterDef(name = "deletedFilter", parameters = {@ParamDef(name = "deleted", type = "boolean")})
@Filter(name = "deletedFilter", condition = "deleted = :deleted")
@FilterDef(name = "archivedFilter", parameters = {@ParamDef(name = "archived", type = "boolean")})
@Filter(name = "archivedFilter", condition = "archived = :archived")
public class Project extends AbstractAuditEntity implements TenantSupport, Serializable {

    @Column(name = "[key]")
    private String key;

    private String name;

    private String description;

    @Column(columnDefinition = "TINYINT")
    private boolean deleted;

    @Column(columnDefinition = "TINYINT")
    private boolean archived;

    @Column(name = "organization_id")
    private Long organizationId;

    @OneToMany(mappedBy = "project", cascade = CascadeType.PERSIST)
    @Where(clause = "archived = 0")
    private List<Environment> environments;

}
