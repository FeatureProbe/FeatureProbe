UPDATE toggle SET created_by = 1,  modified_by = 1;
alter table toggle modify modified_by bigint not null;
alter table toggle modify created_by bigint not null;

UPDATE attribute SET created_by = 1,  modified_by = 1;
alter table attribute modify modified_by bigint not null;
alter table attribute modify created_by bigint not null;

UPDATE environment SET created_by = 1,  modified_by = 1;
alter table environment modify modified_by bigint not null;
alter table environment modify created_by bigint not null;

UPDATE member SET created_by = 1,  modified_by = 1;
alter table member modify modified_by bigint not null;
alter table member modify created_by bigint not null;

UPDATE project SET created_by = 1,  modified_by = 1;
alter table project modify modified_by bigint not null;
alter table project modify created_by bigint not null;

UPDATE segment SET created_by = 1,  modified_by = 1;
alter table segment modify modified_by bigint not null;
alter table segment modify created_by bigint not null;

UPDATE tag SET created_by = 1,  modified_by = 1;
alter table tag modify modified_by bigint not null;
alter table tag modify created_by bigint not null;

UPDATE targeting SET created_by = 1,  modified_by = 1;
alter table targeting modify modified_by bigint not null;
alter table targeting modify created_by bigint not null;

UPDATE targeting_segment SET created_by = 1,  modified_by = 1;
alter table targeting_segment modify modified_by bigint not null;
alter table targeting_segment modify created_by bigint not null;

UPDATE targeting_version SET created_by = 1,  modified_by = 1;
alter table targeting_version modify modified_by bigint not null;
alter table targeting_version modify created_by bigint not null;