alter table member add status VARCHAR(64) DEFAULT 'ACTIVE' after `password`;
alter table member add nickname VARCHAR(64)  after `account`;
ALTER TABLE member MODIFY account varchar(128) NULL;