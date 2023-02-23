alter table metric add name VARCHAR(64) after `organization_id`;
alter table metric add description text after `name`;
alter table metric add unit VARCHAR(64) after `description`;
alter table metric add win_criteria VARCHAR(64) after `unit`;