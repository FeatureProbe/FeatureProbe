alter table segment
    add description varchar(1024) default '' not null,
    add deleted       tinyint default 0 not null;
