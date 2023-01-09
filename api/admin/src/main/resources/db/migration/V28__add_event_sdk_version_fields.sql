alter table event add sdk_type VARCHAR(64) default '' not null after toggle_version;
alter table event add sdk_version VARCHAR(64) default '' not null after toggle_version;