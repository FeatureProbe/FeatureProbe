create table toggle_control_conf
(
    `id`                  bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id`     bigint       default 1                 not null,
    `toggle_key`          varchar(256) default ''                not null,
    `project_key`         varchar(256) default ''                not null,
    `environment_key`     varchar(256) default ''                not null,

    `track_access_events` tinyint      default 0                 not null,
    `track_start_time`    datetime,
    `track_end_time`      datetime,

    `last_modified`       datetime(3) not null,
    `modified_time`       datetime     default CURRENT_TIMESTAMP not null,
    `created_by`          bigint                                 not null,
    `created_time`        datetime     default CURRENT_TIMESTAMP not null,
    `modified_by`         bigint                                 not null,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB collate = utf8mb4_unicode_ci;