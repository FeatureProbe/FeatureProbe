alter table segment
    add unique_key varchar(1024) not null;

UPDATE segment SET unique_key = concat(concat(project_key, '$'), `key`)