alter table targeting_segment
    add targeting_id bigint not null,
    add project_key varchar(128) not null,
    drop column targeting_key;