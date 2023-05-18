package io.featureprobe.api.dao.entity;

import io.featureprobe.api.base.enums.MemberStatusEnum;
import io.featureprobe.api.base.enums.OrganizationRoleEnum;
import io.featureprobe.api.dao.listener.MemberEntityInterceptor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.Immutable;
import org.hibernate.annotations.ParamDef;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
@EntityListeners(MemberEntityInterceptor.class)
public class Member extends AbstractAuditEntity {

    @Column(nullable = false, updatable = false)
    private String account;

    private String nickname;

    private String password;

    @Enumerated(EnumType.STRING)
    private MemberStatusEnum status;

    @Column(name = "visited_time")
    private Date visitedTime;

    @Column(columnDefinition = "TINYINT")
    private Boolean deleted;

    private String source;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
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
