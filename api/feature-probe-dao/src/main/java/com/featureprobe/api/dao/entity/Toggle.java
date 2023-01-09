package com.featureprobe.api.dao.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.featureprobe.api.dao.listener.TenantEntityListener;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.JoinColumnOrFormula;
import org.hibernate.annotations.JoinColumnsOrFormulas;
import org.hibernate.annotations.ParamDef;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import java.util.HashSet;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Getter
@Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Entity
@Table(name = "toggle")
@DynamicInsert
@EntityListeners(TenantEntityListener.class)
@FilterDef(name = "tenantFilter", parameters = {@ParamDef(name = "organizationId", type = "long")})
@Filter(name = "tenantFilter", condition = "organization_id = :organizationId")
@FilterDef(name = "deletedFilter", parameters = {@ParamDef(name = "deleted", type = "boolean")})
@Filter(name = "deletedFilter", condition = "deleted = :deleted")
@FilterDef(name = "archivedFilter", parameters = {@ParamDef(name = "archived", type = "boolean")})
@Filter(name = "archivedFilter", condition = "archived = :archived")
public class Toggle extends AbstractAuditEntity implements TenantSupport {

    private String name;

    @Column(name = "[key]")
    private String key;

    @Column(columnDefinition = "BIT", length = 1)
    private boolean permanent;

    @Column(name = "description", columnDefinition = "TEXT")
    private String desc;

    @Column(name = "return_type", columnDefinition = "CHAR")
    private String returnType;

    @Column(name = "disabled_serve")
    private Integer disabledServe;

    @Column(columnDefinition = "TEXT")
    private String variations;

    @Column(name = "project_key")
    private String projectKey;

    @Column(name = "client_availability", columnDefinition = "BIT", length = 1)
    private Boolean clientAvailability;

    @Column(columnDefinition = "BIT", length = 1)
    private boolean archived;

    @Column(columnDefinition = "BIT", length = 1)
    private boolean deleted;

    @Column(name = "organization_id")
    private Long organizationId;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "toggle_tag", joinColumns = {@JoinColumn(name = "toggle_key", referencedColumnName = "key")},
            inverseJoinColumns = {@JoinColumn(name = "tag_id", referencedColumnName = "id"),
            @JoinColumn(name = "organization_id", referencedColumnName = "organization_id")})
    private Set<Tag> tags = new HashSet<>();

    public String uniqueKey() {
        return projectKey + "&" + key;
    }
}
