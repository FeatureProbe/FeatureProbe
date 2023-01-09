alter table organize rename to organization;
alter table organize_user rename to organization_member;


ALTER TABLE attribute CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE environment CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE project CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE segment CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE tag CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE targeting CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE targeting_segment CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE targeting_version CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE toggle CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE toggle_tag CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE variation_history CHANGE organize_id organization_id bigint default 1 not null;
ALTER TABLE organization_member CHANGE organize_id organization_id bigint;
ALTER TABLE organization_member CHANGE user_id member_id bigint;