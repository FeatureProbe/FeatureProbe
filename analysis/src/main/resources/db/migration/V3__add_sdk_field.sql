alter table events add sdk_type VARCHAR(64) default '' not null after sdk_key;
alter table events add sdk_version VARCHAR(64) default '' not null after sdk_key;