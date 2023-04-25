CREATE TABLE event_tracker
(
    `id`              bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id` bigint         NOT NULL,
    `project_key`     varchar(128)  NOT NULL,
    `environment_key` varchar(128)   NOT NULL,
    `uuid`            varchar(128)  NOT NULL,
    `time`            bigint  NOT NULL,
    `created_by`      bigint  NOT NULL,
    `modified_by`     bigint  NOT NULL,
    `created_time`    datetime default CURRENT_TIMESTAMP NOT NULL,
    `modified_time`   datetime default CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB collate = utf8mb4_unicode_ci;


CREATE TABLE debug_event
(
    `id`              bigint(20)         unsigned NOT NULL AUTO_INCREMENT,
    `kind`            varchar(256)       NOT NULL,
    `sdk_key`         varchar(256)       NOT NULL,
    `time`            bigint             NOT NULL,
    `toggle_key`      varchar(256)       NOT NULL,
    `variation_index` int                NOT NULL,
    `rule_index`      int ,
    `version`         int ,
    `user_key`        varchar(1024)       NOT NULL,
    `user_detail`     text,
    `value`           text,
    `reason`          text,
    `sdk_type`        varchar(256),
    `sdk_version`        varchar(256),
     PRIMARY KEY (`id`)
) ENGINE = InnoDB collate = utf8mb4_unicode_ci;

alter table environment add debugger_until_time bigint(20) unsigned default 0 after `enable_approval`;

alter table traffic add value text after `count`;