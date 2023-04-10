CREATE TABLE prerequisite
(
    `id`              bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id`  bigint         NOT NULL,
    `project_key`       varchar(128)  NOT NULL,
    `toggle_key`       varchar(128)   NOT NULL,
    `environment_key`  varchar(128)   NOT NULL,
    `parent_toggle_key` varchar(128)  NOT NULL,
    `dependent_value`   text     NOT NULL,
    `created_by`      bigint  NOT NULL,
    `modified_by`     bigint  NOT NULL,
    `created_time`   datetime default CURRENT_TIMESTAMP NOT NULL,
    `modified_time`  datetime default CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB collate = utf8mb4_unicode_ci;