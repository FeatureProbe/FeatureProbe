create table access_events
(
    time            timestamp    not null,
    user_key        varchar(256) not null,
    toggle_key      varchar(256) not null,
    variation_index integer      not null,
    rule_index      integer      null,
    version         integer      null,
    sdk_key         varchar(256) not null
);

create table custom_events
(
    time     timestamp        not null,
    user_key varchar(256)     not null,
    name     varchar(256)     not null,
    value    double precision not null,
    sdk_key  varchar(256)     not null
);

insert into access_events
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values ('2023-02-02 23:35:44.659', 'user1', 'toggle_1', 1, 1, 1, 'sdk_key');

insert into access_events
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values ('2023-02-02 23:35:44.659', 'user2', 'toggle_1', 2, 1, 1, 'sdk_key');

insert into access_events
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values ('2023-02-02 23:35:44.659', 'user3', 'toggle_1', 1, 1, 1, 'sdk_key');

insert into access_events
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values ('2023-02-02 23:35:44.659', 'user4', 'toggle_1', 2, 1, 1, 'sdk_key');

insert into access_events
(time, user_key, toggle_key, variation_index, rule_index, version, sdk_key)
values ('2023-02-02 23:35:44.659', 'user5', 'toggle_1', 1, 1, 1, 'sdk_key');

insert into custom_events
    (time, user_key, name, value, sdk_key)
values ('2023-02-02 23:35:44.659', 'user1', 'click_1', 1, 'sdk_key');

insert into custom_events
    (time, user_key, name, value, sdk_key)
values ('2023-02-02 23:35:44.659', 'user2', 'click_1', 1, 'sdk_key');

insert into custom_events
    (time, user_key, name, value, sdk_key)
values ('2023-02-02 23:35:44.659', 'user5', 'click_1', 1, 'sdk_key');
