drop table events;

create table events
(
    time     bigint           not null,
    user_key varchar(256)     not null,
    name     varchar(256)     not null,
    value    double precision null,
    sdk_key  varchar(256)     not null,
    sdk_type  varchar(64)     not null,
    sdk_version  varchar(64)  not null
);