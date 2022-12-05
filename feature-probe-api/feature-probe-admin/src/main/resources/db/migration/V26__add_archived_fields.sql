alter table project add archived tinyint default 0 not null after deleted;
alter table environment add archived tinyint default 0 not null after deleted;