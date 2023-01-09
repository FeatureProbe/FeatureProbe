alter table member add source VARCHAR(256) default '' not null after deleted;

create table operation_logs
(
    `id`            bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `res_param`     text,
    `req_param`     text,
    `type`          varchar(64)  NOT NULL DEFAULT '',
    `account`       varchar(128) NOT NULL DEFAULT '',
    `created_time`  datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB collate = utf8mb4_unicode_ci;