create unique index unique_key on project(organization_id, `key`);

create unique index unique_key on environment(organization_id, project_key, `key`);
create unique index unique_server_key on environment(server_sdk_key);
create unique index unique_client_key on environment(client_sdk_key);

create unique index unique_key on toggle(organization_id, project_key, `key`);

create unique index unique_key on targeting(organization_id, project_key, environment_key, toggle_key);

create unique index unique_key on segment(organization_id, project_key, `key`);



