create table access
(
    time            bigint       not null,
    user_key        varchar(256) not null,
    toggle_key      varchar(256) not null,
    variation_index integer      not null,
    rule_index      integer      null,
    version         integer      null,
    sdk_key         varchar(256) not null
);

create table events
(
    time     bigint           not null,
    user_key varchar(256)     not null,
    name     varchar(256)     not null,
    value    double precision not null,
    sdk_key  varchar(256)     not null
);

