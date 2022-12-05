create table access_token
(
    `id`              bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    `organization_id` bigint       default 1                 not null,
    `name`            varchar(256) default ''                not null,
    `type`            varchar(32)  default ''                not null,
    `token`           varchar(128) default ''                not null,
    `member_id`       bigint,
    `role`            varchar(32),
    `deleted`         tinyint                                NOT NULL DEFAULT '0',
    `visited_time`    datetime,
    `modified_time`   datetime     default CURRENT_TIMESTAMP not null,
    `created_by`      bigint                                 not null,
    `created_time`    datetime     default CURRENT_TIMESTAMP not null,
    `modified_by`     bigint                                 not null,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB collate = utf8mb4_unicode_ci;

create index idx_member_id
    on access_token (member_id);

create index idx_token
    on access_token (token);