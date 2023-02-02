create table event
(
    `id`              bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id` bigint       default 1                 not null,
    `type`            varchar(32)  default ''                not null,
    `name`            varchar(256)                                  ,
    `metric`          varchar(32)                                   ,
    `matcher`         varchar(32)                                   ,
    `url`             text                                          ,
    `selector`        text                                          ,
    `modified_time`   datetime     default CURRENT_TIMESTAMP not null,
    `created_by`      bigint                                 not null,
    `created_time`    datetime     default CURRENT_TIMESTAMP not null,
    `modified_by`     bigint                                 not null,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB collate = utf8mb4_unicode_ci;

create table targeting_event
(
    `id`              bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id` bigint                                 not null,
    `event_id`    bigint(20)                             not null,
    `toggle_key`      varchar(128)                           not null,
    `environment_key` varchar(128)                           not null,
    `project_key`     varchar(128)                           not null,
    `modified_time`   datetime     default CURRENT_TIMESTAMP not null,
    `created_by`      bigint                                 not null,
    `created_time`    datetime     default CURRENT_TIMESTAMP not null,
    `modified_by`     bigint                                 not null,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB collate = utf8mb4_unicode_ci;