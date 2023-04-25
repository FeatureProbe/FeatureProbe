package com.featureprobe.api.dao.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "debug_event")
@DynamicInsert
public class DebugEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String kind;

    @Column(name = "sdk_key")
    private String sdkKey;

    private Long time;

    @Column(name = "toggle_key")
    private String toggleKey;

    @Column(name = "variation_index")
    private Integer variationIndex;

    @Column(name = "rule_index")
    private Integer ruleIndex;

    private Integer version;

    @Column(name = "user_key")
    private String userKey;

    @Column(name = "user_detail", columnDefinition = "TEXT")
    private String userDetail;

    @Column(columnDefinition = "TEXT")
    private String value;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "sdk_type")
    private String sdkType;

    @Column(name = "sdk_version")
    private String sdkVersion;
}
