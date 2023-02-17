create table access
(
    time            bigint    not null,
    user_key        varchar(256) not null,
    toggle_key      varchar(256) not null,
    variation_index integer      not null,
    rule_index      integer      null,
    version         integer      null,
    sdk_key         varchar(256) not null
);

create table events
(
    time     bigint        not null,
    user_key varchar(256)     not null,
    name     varchar(256)     not null,
    value    double precision not null,
    sdk_key  varchar(256)     not null
);

insert into access
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values (1676273668, 'user1', 'toggle_1', 1, 1, 1, 'sdk_key');

insert into access
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values (1676273668, 'user2', 'toggle_1', 2, 1, 1, 'sdk_key');

insert into access
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values (1676273668, 'user3', 'toggle_1', 1, 1, 1, 'sdk_key');

insert into access
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values (1676273668, 'user4', 'toggle_1', 2, 1, 1, 'sdk_key');

insert into access
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values (1676273668, 'user5', 'toggle_1', 1, 1, 1, 'sdk_key');

insert into events
    (time, user_key, name, value, sdk_key)
values (1676273668, 'user1', 'click_1', 1, 'sdk_key');

insert into events
    (time, user_key, name, value, sdk_key)
values (1676273668, 'user2', 'click_1', 1, 'sdk_key');

insert into events
    (time, user_key, name, value, sdk_key)
values (1676273668, 'user5', 'click_1', 1, 'sdk_key');
