create table webhook_settings
(
    `id`             bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id` bigint    default 0         not null,
    `name`           varchar(64) NOT NULL,
    `status`         varchar(64) default 0,
    `url`            varchar(2048) NOT NULL,
    `type`           varchar(64) NOT NULL,
    `secret_key`     varchar(1024) NOT NULL,
    `description`    varchar(1024) NOT NULL,
    `lasted_status`  varchar(64),
    `lasted_status_code`  int,
    `lasted_time`    datetime,
    `modified_by`    bigint(20)   NOT NULL DEFAULT 0,
    `created_by`     bigint(20)   NOT NULL DEFAULT 0,
    `created_time`   datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB collate = utf8mb4_unicode_ci;

