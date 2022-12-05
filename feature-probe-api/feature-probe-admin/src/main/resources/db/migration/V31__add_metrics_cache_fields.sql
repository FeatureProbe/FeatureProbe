alter table metrics_cache add type varchar(32) default "METRICS" not null after toggle_key;
alter table targeting add status varchar(32) default "RELEASE" not null after project_key;