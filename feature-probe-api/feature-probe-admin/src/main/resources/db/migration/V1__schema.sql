create table SPRING_SESSION
(
    PRIMARY_ID            char(36)     not null
        primary key,
    SESSION_ID            char(36)     not null,
    CREATION_TIME         bigint       not null,
    LAST_ACCESS_TIME      bigint       not null,
    MAX_INACTIVE_INTERVAL int          not null,
    EXPIRY_TIME           bigint       not null,
    PRINCIPAL_NAME        varchar(100) null,
    constraint SPRING_SESSION_IX1
        unique (SESSION_ID)
);

create index SPRING_SESSION_IX2
    on SPRING_SESSION (EXPIRY_TIME);

create index SPRING_SESSION_IX3
    on SPRING_SESSION (PRINCIPAL_NAME);

create table SPRING_SESSION_ATTRIBUTES
(
    SESSION_PRIMARY_ID char(36)     not null,
    ATTRIBUTE_NAME     varchar(200) not null,
    ATTRIBUTE_BYTES    blob         not null,
    primary key (SESSION_PRIMARY_ID, ATTRIBUTE_NAME),
    constraint SPRING_SESSION_ATTRIBUTES_FK
        foreign key (SESSION_PRIMARY_ID) references SPRING_SESSION (PRIMARY_ID)
            on delete cascade
);

create table attribute
(
    id            bigint auto_increment
        primary key,
    `key`         varchar(256)      not null,
    project_key   varchar(128)      not null,
    deleted       tinyint default 0 not null,
    modified_by   varchar(32)       not null,
    created_by    varchar(32)       not null,
    created_time  datetime          not null,
    modified_time datetime          not null
)
    collate = utf8mb4_unicode_ci;

create table config
(
    id             bigint auto_increment
        primary key,
    toggle_id      bigint            not null,
    environment_id bigint            not null,
    version        bigint            not null,
    status         char(10)          not null,
    content        text              not null,
    deleted        tinyint default 0 not null,
    modified_by    bigint            not null,
    created_by     bigint            not null,
    created_time   datetime          not null,
    modified_time  datetime          not null
)
    collate = utf8mb4_unicode_ci;

create table config_segment
(
    id            bigint auto_increment
        primary key,
    config_id     bigint   null,
    segment_id    bigint   not null,
    modified_by   bigint   not null,
    created_by    bigint   not null,
    created_time  datetime not null,
    modified_time datetime not null
)
    collate = utf8mb4_unicode_ci;

create table environment
(
    id             int auto_increment
        primary key,
    name           varchar(128)      not null,
    `key`          varchar(128)      not null,
    project_key    varchar(128)      not null,
    server_sdk_key varchar(128)      not null,
    client_sdk_key varchar(128)      not null,
    deleted        tinyint default 0 not null,
    modified_time  datetime          not null,
    created_by     varchar(32)       not null,
    created_time   datetime          not null,
    modified_by    varchar(32)       not null
)
    collate = utf8mb4_unicode_ci;

create index idx_key
    on environment (project_key);

create table event
(
    id           bigint auto_increment
        primary key,
    type         varchar(32)  not null,
    sdk_key      varchar(128) not null,
    toggle_key   varchar(128) not null,
    variation    text         not null,
    count        bigint       not null,
    start_date   datetime     not null,
    end_date     datetime     not null,
    created_time datetime     not null
)
    collate = utf8mb4_unicode_ci;


CREATE TABLE `member`
(
    `id`            bigint       NOT NULL AUTO_INCREMENT,
    `account`       varchar(128) NOT NULL,
    `password`      varchar(256) NOT NULL,
    `role`          varchar(32)  NOT NULL,
    `deleted`       tinyint      NOT NULL DEFAULT '0',
    `visited_time`  datetime,
    `modified_time` datetime     NOT NULL,
    `created_by`    varchar(32)  NOT NULL,
    `created_time`  datetime     NOT NULL,
    `modified_by`   varchar(32)  NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_account` (`account`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci COMMENT ='members';

create table project
(
    id            int auto_increment
        primary key,
    `key`         varchar(128)      not null,
    name          varchar(256)      not null,
    description   varchar(1024)     null,
    deleted       tinyint default 0 not null,
    modified_time datetime          not null,
    created_by    varchar(32)       not null,
    created_time  datetime          not null,
    modified_by   varchar(32)       not null
)
    collate = utf8mb4_unicode_ci;

create index idx_key
    on project (`key`);

create table segment
(
    id            bigint auto_increment
        primary key,
    project_key   varchar(128) not null,
    name          varchar(256) not null,
    `key`         varchar(128) not null,
    rules         text         not null,
    modified_by   varchar(32)  not null,
    created_by    varchar(32)  not null,
    created_time  datetime     not null,
    modified_time datetime     not null
)
    collate = utf8mb4_unicode_ci;

create table tag
(
    id            bigint auto_increment
        primary key,
    name          varchar(256)      not null,
    project_key   varchar(128)      not null,
    deleted       tinyint default 0 not null,
    modified_by   varchar(32)       not null,
    created_by    varchar(32)       not null,
    created_time  datetime          not null,
    modified_time datetime          not null
)
    collate = utf8mb4_unicode_ci;

create table targeting
(
    id              bigint auto_increment
        primary key,
    toggle_key      varchar(128)      not null,
    environment_key varchar(128)      not null,
    project_key     varchar(128)      not null,
    version         bigint  default 1 not null,
    disabled        tinyint default 1 not null,
    content         text              not null,
    deleted         tinyint default 0 not null,
    modified_by     varchar(32)       not null,
    created_by      varchar(32)       not null,
    created_time    datetime          not null,
    modified_time   datetime          not null
)
    collate = utf8mb4_unicode_ci;

create table targeting_segment
(
    id            bigint auto_increment
        primary key,
    targeting_key varchar(128) not null,
    segment_key   varchar(128) not null,
    modified_by   varchar(32)  not null,
    created_by    varchar(32)  not null,
    created_time  datetime     not null,
    modified_time datetime     not null
)
    collate = utf8mb4_unicode_ci;

create table toggle
(
    id                  bigint auto_increment
        primary key,
    name                varchar(128)      not null,
    `key`               varchar(128)      not null,
    description         text              null,
    return_type         char(10)          not null,
    disabled_serve      int               not null,
    variations          text              not null,
    project_key         varchar(128)      not null,
    archived            tinyint default 0 not null,
    client_availability tinyint default 0 not null,
    deleted             tinyint default 0 not null,
    modified_by         varchar(32)       not null,
    created_by          varchar(32)       not null,
    created_time        datetime          not null,
    modified_time       datetime          not null
)
    collate = utf8mb4_unicode_ci;

create index idx_key
    on toggle (`key`);

create table toggle_tag
(
    id         bigint auto_increment
        primary key,
    tag_id     bigint       not null,
    toggle_key varchar(128) not null
)
    collate = utf8mb4_unicode_ci;

