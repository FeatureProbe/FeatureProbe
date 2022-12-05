create table dictionary
(
    `id`            bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `value`         text,
    `key`           varchar(1024) NOT NULL DEFAULT '',
    account         varchar(128) NOT NULL DEFAULT '',
    `deleted`       tinyint      NOT NULL DEFAULT '0',
    `modified_time` datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_by`    bigint not null,
    `created_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_by`   bigint not null,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB collate = utf8mb4_unicode_ci;