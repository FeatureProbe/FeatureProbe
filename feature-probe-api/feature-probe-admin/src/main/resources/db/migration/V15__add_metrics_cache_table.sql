create table metrics_cache
(
    `id`            bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    sdk_key    varchar(128)   default ""        not null,
    toggle_key varchar(128)  default ""        not null,
    data         text,
    start_date   datetime    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date     datetime    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB collate = utf8mb4_unicode_ci;