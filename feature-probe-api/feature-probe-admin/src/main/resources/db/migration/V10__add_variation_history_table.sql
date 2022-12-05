create table variation_history
(
    `id`            bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    project_key     varchar(128) NOT NULL DEFAULT '',
    toggle_key      varchar(128) NOT NULL DEFAULT '',
    environment_key varchar(128) NOT NULL DEFAULT '',
    toggle_version  bigint       NOT NULL DEFAULT 0,
    `value`         text,
    `value_index`   int(10) NOT NULL DEFAULT 0,
    name            varchar(128) NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
)ENGINE=InnoDB collate = utf8mb4_unicode_ci;