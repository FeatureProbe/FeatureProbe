create table segment_version
(
    id             int auto_increment primary key,
    organization_id bigint        default 1         not null,
    project_key    varchar(128)  default ''         not null,
    `key`          varchar(128)  default ''         not null,
    comment        varchar(1024)  default ""        not null,
    rules          text                             not null,
    version        bigint         default 0         not null,
    modified_time   datetime      default CURRENT_TIMESTAMP not null,
    created_by      bigint                                  not null,
    created_time    datetime      default CURRENT_TIMESTAMP not null,
    modified_by     bigint                                  not null,
    approval_id     bigint                                  null
) collate = utf8mb4_unicode_ci;

UPDATE segment SET version = 1;
Insert into segment_version(organization_id, project_key, `key`, rules, version, modified_time, created_by, created_time, modified_by) Select organization_id, project_key, `key`, rules, 1, modified_time, created_by, created_time, modified_by  from segment ;
