create table targeting_version
(
    id             int auto_increment primary key,
    targeting_id   bigint         default 0         not null,
    project_key    varchar(128)   default ""        not null,
    environment_key varchar(128)  default ""        not null,
    comment        varchar(1024)  default ""        not null,
    content        text                   not null,
    version        bigint         default 0         not null,
    deleted        tinyint        default 0         not null,
    modified_time  datetime       default  CURRENT_TIMESTAMP  not null,
    created_by     varchar(32)    default ""   not null,
    created_time   datetime       default  CURRENT_TIMESTAMP  not null,
    modified_by    varchar(32)    default ""   not null
) collate = utf8mb4_unicode_ci;