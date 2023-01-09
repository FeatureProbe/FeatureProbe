alter table toggle add permanent tinyint default 0 not null after `key`;
UPDATE toggle SET permanent = 1;