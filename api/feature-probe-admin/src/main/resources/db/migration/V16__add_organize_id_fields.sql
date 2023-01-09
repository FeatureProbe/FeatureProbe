create table organize
(
    id              bigint auto_increment primary key,
    name           varchar(64)    default ""   not null,
    `deleted`       tinyint      NOT NULL DEFAULT '0',
    modified_time  datetime       default  CURRENT_TIMESTAMP  not null,
    created_by     bigint not null,
    created_time   datetime       default  CURRENT_TIMESTAMP  not null,
    modified_by    bigint not null
) collate = utf8mb4_unicode_ci;

INSERT INTO organize(id, name, modified_time, created_by, created_time, modified_by) VALUES
(1, "Default Organize", now(), 1, now(), 1);

create table organize_user
(
    id             bigint auto_increment primary key,
    organize_id    bigint   not null,
    user_id        bigint   not null,
    `role`         varchar(32) default 'OWNER'  NOT NULL,
    `modified_time` datetime default  CURRENT_TIMESTAMP  not null,
    `created_by`    bigint  default 1 NOT NULL,
    `created_time`  datetime default  CURRENT_TIMESTAMP  not null,
    `modified_by`   bigint  default 1 NOT NULL
) collate = utf8mb4_unicode_ci;

insert into organize_user(organize_id, user_id, role, modified_time, created_by, created_time, modified_by)
(SELECT 1, id as user_id, "OWNER", now(), 1, now(), 1 FROM member where deleted = 0);

alter table attribute add organize_id bigint default 1 not null after id;
alter table environment add organize_id bigint default 1 not null after id;
alter table project add organize_id bigint default 1 not null after id;
alter table segment add organize_id bigint default 1 not null after id;
alter table tag add organize_id bigint default 1 not null after id;
alter table targeting add organize_id bigint default 1 not null after id;
alter table targeting_segment add organize_id bigint default 1 not null after id;
alter table targeting_version add organize_id bigint default 1 not null after id;
alter table toggle add organize_id bigint default 1 not null after id;
alter table toggle_tag add organize_id bigint default 1 not null after id;
alter table variation_history add organize_id bigint default 1 not null after id;




