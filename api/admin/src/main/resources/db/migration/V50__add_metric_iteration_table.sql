create table metric_iteration
(
    `id`                  bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id`     bigint       default 1                 not null,
    `toggle_key`          varchar(256) default ''                not null,
    `project_key`         varchar(256) default ''                not null,
    `environment_key`     varchar(256) default ''                not null,
    `start`    datetime,
    `stop`     datetime,

    `modified_time`       datetime     default CURRENT_TIMESTAMP not null,
    `created_by`          bigint                                 not null,
    `created_time`        datetime     default CURRENT_TIMESTAMP not null,
    `modified_by`         bigint                                 not null,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB collate = utf8mb4_unicode_ci;

insert into metric_iteration(organization_id, toggle_key, environment_key, project_key, start, stop,
                             modified_time, created_by, created_time, modified_by)
SELECT organization_id, toggle_key, environment_key, project_key, track_start_time as start,  track_end_time as stop,
       modified_time, created_by, created_time, modified_by from toggle_control_conf;
