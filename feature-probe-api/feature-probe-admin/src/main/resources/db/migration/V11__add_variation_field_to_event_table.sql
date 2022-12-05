alter table event
    add toggle_version bigint(20) not null DEFAULT 0 after toggle_key,
    add value_index int default 0 not null DEFAULT 0 after toggle_version,
    add project_key varchar(128) NOT NULL DEFAULT ''  after toggle_key,
    add environment_key varchar(128) NOT NULL DEFAULT '' after toggle_key;

alter table event drop column variation;