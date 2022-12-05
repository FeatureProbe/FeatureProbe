create table approval_record
(
    `id`              bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id` bigint     NOT null DEFAULT 0,
    `project_key`     varchar(128) NOT NULL DEFAULT '',
    `environment_key` varchar(128) NOT NULL DEFAULT '',
    `toggle_key`      varchar(128) NOT NULL DEFAULT '',
    `submit_by`       varchar(128)   NOT NULL DEFAULT '',
    `approved_by`     varchar(128)   NOT NULL DEFAULT '',
    `reviewers`        varchar(256) NOT NULL DEFAULT '',
    `status`          varchar(64)  NOT NULL DEFAULT '',
    `title`           varchar(1024) NOT NULL DEFAULT '',
    `comment`     TEXT,
    `modified_by`     bigint(20)   NOT NULL DEFAULT 0,
    `created_by`      bigint(20)   NOT NULL DEFAULT 0,
    `created_time`    datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_time`   datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB collate = utf8mb4_unicode_ci;

create table targeting_sketch (
    `id` bigint(20)      unsigned NOT NULL AUTO_INCREMENT,
    `approval_id` bigint     NOT null DEFAULT 0,
    `organization_id` bigint     NOT null DEFAULT 0,
    `project_key`     varchar(128) NOT NULL DEFAULT '',
    `environment_key` varchar(128) NOT NULL DEFAULT '',
    `toggle_key`      varchar(128) NOT NULL DEFAULT '',
    `old_version`     bigint  default 0 not null,
    `content`            text,
    `comment`         varchar(1024) default '' not null,
    `disabled`        tinyint default 1 not null,
    `status`          varchar(64)  NOT NULL DEFAULT '',
    `modified_by`          bigint(20)   NOT NULL DEFAULT 0,
    `created_by`          bigint(20)   NOT NULL DEFAULT 0,
    `created_time`    datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_time`    datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB collate = utf8mb4_unicode_ci;

alter table environment add enable_approval tinyint default 0 not null after deleted;
alter table environment add reviewers VARCHAR(256) default '' not null after deleted;
alter table targeting_version add approval_id bigint;


