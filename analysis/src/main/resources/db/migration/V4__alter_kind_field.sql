drop table events;

create table events
(
    time     bigint           not null,
    user_key varchar(256)     not null,
    name     varchar(256)     not null,
    value    double precision null,
    sdk_key  varchar(256)     not null,
    sdk_type  varchar(64)     not null,
    sdk_version  varchar(64)  not null,
    kind varchar(64)  not null
);

drop table access;

create table access
(
    time            bigint       not null,
    user_key        varchar(256) not null,
    toggle_key      varchar(256) not null,
    variation_index integer      not null,
    rule_index      integer      null,
    version         integer      null,
    sdk_key         varchar(256) not null,
    sdk_type  varchar(64) not null,
    sdk_version  varchar(64) not null,
    value text not null
);
