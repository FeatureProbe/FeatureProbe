alter table targeting_version
     add disabled tinyint default 1 not null after content,
     add toggle_key varchar(128) default "" not null after environment_key,
     drop column targeting_id;