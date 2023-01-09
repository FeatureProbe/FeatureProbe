package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.OrganizationRoleEnum;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "member")
@DynamicInsert
@FilterDef(name = "deletedFilter", parameters = {@ParamDef(name = "deleted", type = "boolean")})
@Filter(name = "deletedFilter", condition = "deleted = :deleted")
@EqualsAndHashCode
public class Member extends AbstractAuditEntity {

    private String account;

    private String password;

    @Column(name = "visited_time")
    private Date visitedTime;

    @Column(columnDefinition = "TINYINT")
    private Boolean deleted;

    private String source;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private List<OrganizationMember> organizationMembers = new ArrayList<>();

    public Member(Long id, String account) {
        super.setId(id);
        this.account = account;
    }

    public List<Organization> getOrganizations() {
        return organizationMembers.stream()
                .map(OrganizationMember::getOrganization)
                .collect(Collectors.toList());
    }

    public void addOrganization(Organization organization, OrganizationRoleEnum role) {
        this.organizationMembers.add(new OrganizationMember(organization, this, role));
    }

    public void deleteOrganization(Long organizationId) {
        OrganizationMember deleteOrganizationMember = null;
        for (OrganizationMember organizationMember : organizationMembers) {
            if (organizationMember.getOrganization().getId().equals(organizationId)) {
                deleteOrganizationMember = organizationMember;
            }
        }
        organizationMembers.remove(deleteOrganizationMember);
    }

    public OrganizationRoleEnum getRole(Long organizationId) {
        for (OrganizationMember organizationMember : organizationMembers) {
            if (organizationMember.getOrganization().getId().equals(organizationId)) {
                return organizationMember.getRole();
            }
        }
        return null;
    }

}
