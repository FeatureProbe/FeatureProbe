create table traffic
(
    id              bigint auto_increment primary key,
    type            varchar(32)             not null,
    sdk_key         varchar(128)            not null,
    toggle_key      varchar(128)            not null,
    environment_key varchar(128) default '' not null,
    project_key     varchar(128) default '' not null,
    toggle_version  bigint       default 0  not null,
    sdk_version     varchar(64)  default '' not null,
    sdk_type        varchar(64)  default '' not null,
    value_index     int          default 0  not null,
    count           bigint                  not null,
    start_date      datetime                not null,
    end_date        datetime                not null,
    created_time    datetime                not null
) collate = utf8mb4_unicode_ci;

create index traffic_index
    on event (sdk_key, toggle_key, start_date, end_date);

insert into traffic(id, type, sdk_key, toggle_key, environment_key, project_key, toggle_version, sdk_version,
                    sdk_type, value_index, count, start_date, end_date, created_time)
    (SELECT * FROM event where start_date > DATE_SUB(now(),INTERVAL 8 day));

create table traffic_cache
(
    id         bigint unsigned auto_increment
        primary key,
    sdk_key    varchar(128) default ''                not null,
    toggle_key varchar(128) default ''                not null,
    type       varchar(32)  default 'METRICS'         not null,
    data       text                                   null,
    start_date datetime     default CURRENT_TIMESTAMP not null,
    end_date   datetime     default CURRENT_TIMESTAMP not null
) collate = utf8mb4_unicode_ci;

drop table event;
drop table metrics_cache;