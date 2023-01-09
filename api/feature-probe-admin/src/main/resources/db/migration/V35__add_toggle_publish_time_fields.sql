alter table targeting add publish_time datetime after `deleted`;
UPDATE targeting t SET publish_time = (SELECT (case when tv.created_time != null then tv.created_time else now() end) from targeting_version tv where tv.organization_id = t.organization_id AND tv.project_key = t.project_key AND tv.environment_key=t.environment_key AND tv.toggle_key=t.toggle_key ORDER BY tv.version desc LIMIT 1);
