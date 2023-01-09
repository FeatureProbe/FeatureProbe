package com.featureprobe.api.dao.entity;

import com.featureprobe.api.base.enums.ChangeLogType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.DynamicInsert;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name = "publish_message")
@ToString(callSuper = true)
@DynamicInsert
public class PublishMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "server_sdk_key")
    private String serverSdkKey;

    @Column(name = "client_sdk_key")
    private String clientSdkKey;

    @Enumerated(EnumType.STRING)
    private ChangeLogType type;

    public PublishMessage(Long id) {
        this.id = id;
    }
}
