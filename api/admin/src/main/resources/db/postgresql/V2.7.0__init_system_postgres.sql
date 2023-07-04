CREATE TABLE "access_token"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "name"            varchar(256) NOT NULL,
    "type"            varchar(32)  NOT NULL,
    "token"           varchar(128) NOT NULL,
    "member_id"       int8,
    "role"            varchar(32),
    "deleted"         BOOLEAN   DEFAULT false,
    "visited_time"    timestamp,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8         NOT NULL,
    PRIMARY KEY ("id")
);
CREATE INDEX "idx_member_id" ON "access_token" USING btree (
    "member_id" ASC
    );
CREATE INDEX "idx_token" ON "access_token" USING btree (
    "token" ASC
    );

CREATE TABLE "approval_record"
(
    "id"              BIGSERIAL     NOT NULL,
    "organization_id" int8          NOT NULL,
    "project_key"     varchar(128)  NOT NULL,
    "environment_key" varchar(128)  NOT NULL,
    "toggle_key"      varchar(128)  NOT NULL,
    "submit_by"       varchar(128)  NOT NULL,
    "approved_by"     varchar(128),
    "reviewers"       varchar(256)  NOT NULL,
    "status"          varchar(64)   NOT NULL,
    "title"           varchar(1024) NOT NULL,
    "comment"         text,
    "modified_by"     int8          NOT NULL,
    "created_by"      int8          NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_32" PRIMARY KEY ("id")
);

CREATE TABLE "attribute"
(
    "id"              int8         NOT NULL,
    "organization_id" int8         NOT NULL,
    "key"             varchar(256) NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "deleted"         BOOLEAN   DEFAULT false,
    "modified_by"     int8         NOT NULL,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_31" PRIMARY KEY ("id")
);

CREATE TABLE "debug_event"
(
    "id"              BIGSERIAL     NOT NULL,
    "kind"            varchar(256)  NOT NULL,
    "sdk_key"         varchar(256)  NOT NULL,
    "time"            int8          NOT NULL,
    "toggle_key"      varchar(256)  NOT NULL,
    "variation_index" int4          NOT NULL,
    "rule_index"      int4,
    "version"         int4,
    "user_key"        varchar(1024) NOT NULL,
    "user_detail"     text,
    "value"           text,
    "reason"          text,
    "sdk_type"        varchar(256),
    "sdk_version"     varchar(256),
    CONSTRAINT "_copy_30" PRIMARY KEY ("id")
);

CREATE TABLE "dictionary"
(
    "id"            BIGSERIAL     NOT NULL,
    "value"         text,
    "key"           varchar(1024) NOT NULL,
    "account"       varchar(128)  NOT NULL,
    "deleted"       BOOLEAN   DEFAULT false,
    "modified_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"    int8          NOT NULL,
    "created_time"  timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"   int8          NOT NULL,
    CONSTRAINT "_copy_29" PRIMARY KEY ("id")
);

CREATE TABLE "environment"
(
    "id"                  BIGSERIAL    NOT NULL,
    "organization_id"     int8         NOT NULL,
    "name"                varchar(128) NOT NULL,
    "key"                 varchar(128) NOT NULL,
    "project_key"         varchar(128) NOT NULL,
    "server_sdk_key"      varchar(128) NOT NULL,
    "client_sdk_key"      varchar(128) NOT NULL,
    "deleted"             BOOLEAN   DEFAULT false,
    "version"             BIGSERIAL,
    "reviewers"           varchar(256),
    "enable_approval"     BOOLEAN   default false,
    "debugger_until_time" BIGSERIAL,
    "archived"            BOOLEAN   DEFAULT false,
    "modified_time"       timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"          int8         NOT NULL,
    "created_time"        timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"         int8         NOT NULL,
    CONSTRAINT "_copy_28" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "unique_key" ON "environment" USING btree (
    "organization_id" ASC,
    "project_key" ASC,
    "key" ASC
    );
CREATE UNIQUE INDEX "unique_server_key" ON "environment" USING btree (
    "server_sdk_key" ASC
    );
CREATE UNIQUE INDEX "unique_client_key" ON "environment" USING btree (
    "client_sdk_key" ASC
    );
CREATE INDEX "idx_key" ON "environment" USING btree (
    "project_key" ASC
    );

CREATE TABLE "event"
(
    "id"              BIGSERIAL NOT NULL,
    "organization_id" int8      NOT NULL,
    "name"            varchar(256),
    "type"            varchar(64),
    "matcher"         varchar(32),
    "url"             text,
    "selector"        text,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8      NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8      NOT NULL,
    CONSTRAINT "_copy_27" PRIMARY KEY ("id")
);

CREATE TABLE "event_tracker"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "environment_key" varchar(128) NOT NULL,
    "uuid"            varchar(128) NOT NULL,
    "time"            int8         NOT NULL,
    "created_by"      int8         NOT NULL,
    "modified_by"     int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_26" PRIMARY KEY ("id")
);

CREATE TABLE "member"
(
    "id"            BIGSERIAL    NOT NULL,
    "account"       varchar(128),
    "nickname"      varchar(64),
    "password"      varchar(256) NOT NULL,
    "status"        varchar(64),
    "deleted"       BOOLEAN   DEFAULT false,
    "source"        varchar(256),
    "visited_time"  timestamp,
    "modified_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"    int8         NOT NULL,
    "created_time"  timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"   int8         NOT NULL,
    CONSTRAINT "_copy_24" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "idx_account" ON "member" USING btree (
    "account" ASC
    );
COMMENT
ON TABLE "member" IS 'members';

CREATE TABLE "metric"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "name"            varchar(64),
    "description"     text,
    "unit"            varchar(64),
    "win_criteria"    varchar(64),
    "denominator"     varchar(1024),
    "type"            varchar(32)  NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "toggle_key"      varchar(128) NOT NULL,
    "environment_key" varchar(128) NOT NULL,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8         NOT NULL,
    CONSTRAINT "_copy_23" PRIMARY KEY ("id")
);

CREATE TABLE "metric_event"
(
    "id"        BIGSERIAL NOT NULL,
    "metric_id" int8      NOT NULL,
    "event_id"  int8      NOT NULL,
    CONSTRAINT "_copy_22" PRIMARY KEY ("id")
);

CREATE TABLE "metric_iteration"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "toggle_key"      varchar(256) NOT NULL,
    "project_key"     varchar(256) NOT NULL,
    "environment_key" varchar(256) NOT NULL,
    "start"           timestamp,
    "stop"            timestamp,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8         NOT NULL,
    CONSTRAINT "_copy_21" PRIMARY KEY ("id")
);

CREATE TABLE "operation_logs"
(
    "id"           BIGSERIAL    NOT NULL,
    "res_param"    text,
    "req_param"    text,
    "type"         varchar(64)  NOT NULL,
    "account"      varchar(128) NOT NULL,
    "created_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_20" PRIMARY KEY ("id")
);

CREATE TABLE "organization"
(
    "id"            BIGSERIAL   NOT NULL,
    "name"          varchar(64) NOT NULL,
    "deleted"       BOOLEAN   DEFAULT false,
    "modified_time" timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"    int8        NOT NULL,
    "created_time"  timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"   int8        NOT NULL,
    CONSTRAINT "_copy_19" PRIMARY KEY ("id")
);

CREATE TABLE "organization_member"
(
    "id"              BIGSERIAL,
    "organization_id" int8,
    "member_id"       int8,
    "role"            varchar(32) NOT NULL,
    "valid"           BOOLEAN   DEFAULT false,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8        NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8        NOT NULL,
    CONSTRAINT "_copy_18" PRIMARY KEY ("id")
);

CREATE TABLE "prerequisite"
(
    "id"                BIGSERIAL    NOT NULL,
    "organization_id"   int8         NOT NULL,
    "project_key"       varchar(128) NOT NULL,
    "toggle_key"        varchar(128) NOT NULL,
    "environment_key"   varchar(128) NOT NULL,
    "parent_toggle_key" varchar(128) NOT NULL,
    "dependent_value"   text         NOT NULL,
    "created_by"        int8         NOT NULL,
    "modified_by"       int8         NOT NULL,
    "created_time"      timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"     timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_17" PRIMARY KEY ("id")
);

CREATE TABLE "project"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "key"             varchar(128) NOT NULL,
    "name"            varchar(256) NOT NULL,
    "description"     varchar(1024),
    "deleted"         BOOLEAN   DEFAULT false,
    "archived"        BOOLEAN   DEFAULT false,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8         NOT NULL,
    CONSTRAINT "_copy_16" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "unique_key_copy_4" ON "project" USING btree (
    "organization_id" ASC,
    "key" ASC
    );
CREATE INDEX "idx_key_copy_2" ON "project" USING btree (
    "key" ASC
    );

CREATE TABLE "publish_message"
(
    "id"             BIGSERIAL    NOT NULL,
    "client_sdk_key" varchar(128) NOT NULL,
    "server_sdk_key" varchar(128) NOT NULL,
    "type"           varchar(128) NOT NULL,
    CONSTRAINT "_copy_15" PRIMARY KEY ("id")
);

CREATE TABLE "segment"
(
    "id"              BIGSERIAL     NOT NULL,
    "organization_id" int8          NOT NULL,
    "project_key"     varchar(128)  NOT NULL,
    "name"            varchar(256)  NOT NULL,
    "key"             varchar(128)  NOT NULL,
    "rules"           text          NOT NULL,
    "modified_by"     int8          NOT NULL,
    "created_by"      int8          NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "description"     varchar(1024) NOT NULL,
    "deleted"         BOOLEAN   DEFAULT false,
    "version"         int8          NOT NULL,
    "unique_key"      varchar(1024) NOT NULL,
    CONSTRAINT "_copy_14" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "unique_key_copy_3" ON "segment" USING btree (
    "organization_id" ASC,
    "project_key" ASC,
    "key" ASC
    );

CREATE TABLE "segment_version"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "key"             varchar(128) NOT NULL,
    "comment"         varchar(1024),
    "rules"           text         NOT NULL,
    "version"         int8         NOT NULL,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8         NOT NULL,
    "approval_id"     int8,
    CONSTRAINT "_copy_13" PRIMARY KEY ("id")
);

CREATE TABLE "tag"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "name"            varchar(256) NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "deleted"         BOOLEAN   DEFAULT false,
    "modified_by"     int8         NOT NULL,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_12" PRIMARY KEY ("id")
);

CREATE TABLE "targeting"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "toggle_key"      varchar(128) NOT NULL,
    "environment_key" varchar(128) NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "status"          varchar(32) default 'RELEASE',
    "version"         BIGSERIAL,
    "disabled"        BOOLEAN     DEFAULT TRUE,
    "content"         text         NOT NULL,
    "deleted"         BOOLEAN     DEFAULT false,
    "publish_time"    timestamp,
    "modified_by"     int8         NOT NULL,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp   DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp   DEFAULT CURRENT_TIMESTAMP,
    "_lock_version"   int8,
    CONSTRAINT "_copy_11" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "unique_key_copy_2" ON "targeting" USING btree (
    "organization_id" ASC,
    "project_key" ASC,
    "environment_key" ASC,
    "toggle_key" ASC
    );

CREATE TABLE "targeting_segment"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "segment_key"     varchar(128) NOT NULL,
    "modified_by"     int8         NOT NULL,
    "created_by"      int8         NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "targeting_id"    int8         NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    CONSTRAINT "_copy_10" PRIMARY KEY ("id")
);

CREATE TABLE "targeting_sketch"
(
    "id"              BIGSERIAL     NOT NULL,
    "approval_id"     int8          NOT NULL,
    "organization_id" int8          NOT NULL,
    "project_key"     varchar(128)  NOT NULL,
    "environment_key" varchar(128)  NOT NULL,
    "toggle_key"      varchar(128)  NOT NULL,
    "old_version"     int8          NOT NULL,
    "content"         text          NOT NULL,
    "comment"         varchar(1024) NOT NULL,
    "disabled"        BOOLEAN   DEFAULT false,
    "status"          varchar(64)   NOT NULL,
    "modified_by"     int8          NOT NULL,
    "created_by"      int8          NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_9" PRIMARY KEY ("id")
);

CREATE TABLE "targeting_version"
(
    "id"              BIGSERIAL     NOT NULL,
    "organization_id" int8          NOT NULL,
    "project_key"     varchar(128)  NOT NULL,
    "environment_key" varchar(128)  NOT NULL,
    "toggle_key"      varchar(128)  NOT NULL,
    "comment"         varchar(1024) NOT NULL,
    "content"         text          NOT NULL,
    "disabled"        BOOLEAN   DEFAULT false,
    "version"         int8          NOT NULL,
    "deleted"         BOOLEAN   DEFAULT false,
    "modified_time"   timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"      int8          NOT NULL,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"     int8          NOT NULL,
    "approval_id"     int8,
    CONSTRAINT "_copy_8" PRIMARY KEY ("id")
);

CREATE TABLE "toggle"
(
    "id"                  BIGSERIAL    NOT NULL,
    "organization_id"     int8         NOT NULL,
    "name"                varchar(128) NOT NULL,
    "key"                 varchar(128) NOT NULL,
    "permanent"           BOOLEAN   default false,
    "description"         text,
    "return_type"         varchar(10)  NOT NULL,
    "disabled_serve"      int4         NOT NULL,
    "variations"          text         NOT NULL,
    "project_key"         varchar(128) NOT NULL,
    "archived"            BOOLEAN   default false,
    "client_availability" BOOLEAN,
    "deleted"             BOOLEAN   default false,
    "modified_by"         int8         NOT NULL,
    "created_by"          int8         NOT NULL,
    "created_time"        timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"       timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_7" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "unique_key_copy_1" ON "toggle" USING btree (
    "organization_id" ASC,
    "project_key" ASC,
    "key" ASC
    );
CREATE INDEX "idx_key_copy_1" ON "toggle" USING btree (
    "key" ASC
    );

CREATE TABLE "toggle_control_conf"
(
    "id"                  BIGSERIAL    NOT NULL,
    "organization_id"     int8         NOT NULL,
    "toggle_key"          varchar(256) NOT NULL,
    "project_key"         varchar(256) NOT NULL,
    "environment_key"     varchar(256) NOT NULL,
    "track_access_events" BOOLEAN   DEFAULT false,
    "track_start_time"    timestamp,
    "track_end_time"      timestamp,
    "last_modified"       timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"       timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_by"          int8         NOT NULL,
    "created_time"        timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_by"         int8         NOT NULL,
    CONSTRAINT "_copy_6" PRIMARY KEY ("id")
);

CREATE TABLE "toggle_tag"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "tag_id"          int8         NOT NULL,
    "toggle_key"      varchar(128) NOT NULL,
    CONSTRAINT "_copy_5" PRIMARY KEY ("id")
);

CREATE TABLE "traffic"
(
    "id"              BIGSERIAL    NOT NULL,
    "type"            varchar(32)  NOT NULL,
    "sdk_key"         varchar(128) NOT NULL,
    "toggle_key"      varchar(128) NOT NULL,
    "environment_key" varchar(128) NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "toggle_version"  int8         NOT NULL,
    "sdk_version"     varchar(64)  NOT NULL,
    "sdk_type"        varchar(64)  NOT NULL,
    "value_index"     int4         NOT NULL,
    "count"           int8         NOT NULL,
    "value"           text,
    "start_date"      timestamp DEFAULT CURRENT_TIMESTAMP,
    "end_date"        timestamp DEFAULT CURRENT_TIMESTAMP,
    "created_time"    timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_4" PRIMARY KEY ("id")
);

CREATE TABLE "traffic_cache"
(
    "id"         BIGSERIAL    NOT NULL,
    "sdk_key"    varchar(128) NOT NULL,
    "toggle_key" varchar(128) NOT NULL,
    "type"       varchar(32)  NOT NULL,
    "data"       text,
    "start_date" timestamp DEFAULT CURRENT_TIMESTAMP,
    "end_date"   timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_3" PRIMARY KEY ("id")
);

CREATE TABLE "variation_history"
(
    "id"              BIGSERIAL    NOT NULL,
    "organization_id" int8         NOT NULL,
    "project_key"     varchar(128) NOT NULL,
    "toggle_key"      varchar(128) NOT NULL,
    "environment_key" varchar(128) NOT NULL,
    "toggle_version"  int8         NOT NULL,
    "value"           text,
    "value_index"     int4         NOT NULL,
    "name"            varchar(128) NOT NULL,
    CONSTRAINT "_copy_2" PRIMARY KEY ("id")
);

CREATE TABLE "webhook_settings"
(
    "id"                 BIGSERIAL     NOT NULL,
    "organization_id"    int8          NOT NULL,
    "name"               varchar(64)   NOT NULL,
    "status"             varchar(64),
    "url"                varchar(2048) NOT NULL,
    "type"               varchar(64)   NOT NULL,
    "secret_key"         varchar(1024) NOT NULL,
    "description"        varchar(1024) NOT NULL,
    "lasted_status"      varchar(64),
    "lasted_status_code" int4,
    "lasted_time"        timestamp,
    "modified_by"        int8          NOT NULL,
    "created_by"         int8          NOT NULL,
    "created_time"       timestamp DEFAULT CURRENT_TIMESTAMP,
    "modified_time"      timestamp DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "_copy_1" PRIMARY KEY ("id")
);


INSERT INTO member (account, nickname, password, status, deleted, source, visited_time, modified_time, created_by,
                    created_time, modified_by)
VALUES ('Admin', 'Admin', '$2a$10$WO5tC7A/nsPe5qmVmjTIPeKD0R/Tm2YsNiVP0geCerT0hIRLBCxZ6', 'ACTIVE', false, 'SYSTEM',
        '2023-07-03 14:26:20.000000', '2023-07-03 14:26:23.000000', 1, '2023-07-03 14:26:34.000000', 1);

INSERT INTO organization (name, deleted, modified_time, created_by, created_time, modified_by)
VALUES ('Manager Organize', false, '2023-07-03 15:07:45.000000', 1, '2023-07-03 15:07:48.000000', 1);

INSERT INTO organization_member (organization_id, member_id, role, valid, modified_time, created_by, created_time,
                                 modified_by)
VALUES (1, 1, 'OWNER', true, '2023-07-03 15:08:30.000000', 1, '2023-07-03 15:08:33.000000', 1);


INSERT INTO dictionary (value, key, account, deleted, modified_time, created_by, created_time, modified_by)
VALUES ('1', 'all_sdk_key_map', 'Admin', false, '2023-07-03 14:27:21.000000', 1, '2023-07-03 14:27:24.000000', 1);

INSERT INTO member (id, account, password, deleted, visited_time, modified_time, created_by, created_time, modified_by)
VALUES (-1, 'manager@featureprobe.com', '$2a$10$WO5tC7A/nsPe5qmVmjTIPeKD0R/Tm2YsNiVP0geCerT0hIRLBCxZ6', true, now(),
        now(), -1, now(), -1);


INSERT INTO organization(id, name, modified_time, created_by, created_time, modified_by)
VALUES (-1, 'Manager Organize', now(), -1, now(), -1);


INSERT INTO organization_member (organization_id, member_id, role, valid, modified_time, created_by, created_time,
                                 modified_by)
VALUES (-1, -1, 'OWNER', true, '2023-07-03 15:08:30.000000', 1, '2023-07-03 15:08:33.000000', 1);

INSERT INTO project (organization_id, key, name, description, deleted, modified_time, created_by, created_time,
                     modified_by)
VALUES (-1, 'feature_probe', 'FeatureProbe', '', false, now(), -1, now(), -1);

INSERT INTO environment (organization_id, name, key, project_key, server_sdk_key, client_sdk_key, deleted,
                         modified_time, created_by, created_time, modified_by)
VALUES (-1, 'online', 'online', 'feature_probe', 'server-t6h78815ef044428826787e9a238b9c6a479f998',
        'client-29765c7e03e9cb49c0e96357b797b1e47e7f2dee', false, now(), -1, now(), -1);

INSERT INTO toggle (organization_id, name, key, description, return_type, disabled_serve, variations, project_key,
                    archived, client_availability, deleted, modified_by, created_by, created_time, modified_time)
VALUES (-1, 'FeatureProbe project limiter', 'FeatureProbe_project_limiter', '', 'number', 0,
        '[{\"value\":\"-1\",\"name\":\"unlimited\",\"description\":\"\"},{\"value\":\"2\",\"name\":\"max\",\"description\":\"\"}]',
        'feature_probe', false, false, false, -1, -1, now(), now());

INSERT INTO toggle (organization_id, name, key, description, return_type, disabled_serve, variations, project_key,
                    archived, client_availability, deleted, modified_by, created_by, created_time, modified_time)
VALUES (-1, 'FeatureProbe env limiter', 'FeatureProbe_env_limiter', '', 'number', 0,
        '[{\"value\":\"-1\",\"name\":\"unlimited\",\"description\":\"\"},{\"value\":\"5\",\"name\":\"max\",\"description\":\"\"}]',
        'feature_probe', false, false, false, -1, -1, now(), now());


INSERT INTO toggle (organization_id, name, key, description, return_type, disabled_serve, variations, project_key,
                    archived, client_availability, deleted, modified_by, created_by, created_time, modified_time)
VALUES (-1, 'FeatureProbe toggle limiter', 'FeatureProbe_toggle_limiter', '', 'number', 0,
        '[{\"value\":\"-1\",\"name\":\"unlimited\",\"description\":\"\"},{\"value\":\"10\",\"name\":\"max\",\"description\":\"\"}]',
        'feature_probe', false, false, false, -1, -1, now(), now());


INSERT INTO toggle (organization_id, name, key, description, return_type, disabled_serve, variations, project_key,
                    archived, client_availability, deleted, modified_by, created_by, created_time, modified_time)
VALUES (-1, 'Control FeatureProbe Demo Features', 'demo_features', 'Control FeatureProbe Demo Features Hide or Show',
        'boolean', 0,
        '[{\"value\":\"false\",\"name\":\"Open Source\",\"description\":\"\"},{\"value\":\"true\",\"name\":\"Demo\",\"description\":\"\"}]',
        'feature_probe', false, true, false, -1, -1, now(), now());


INSERT INTO targeting (organization_id, toggle_key, environment_key, project_key, status, version, disabled, content,
                       deleted, publish_time, modified_by, created_by, created_time, modified_time, _lock_version)
VALUES (-1, 'FeatureProbe_project_limiter', 'online', 'feature_probe', 'RELEASE', 1, false,
        '{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":0},"variations":[{"value":"-1","name":"unlimited","description":""},{"value":"2","name":"max","description":""}]}',
        false, null, -1, -1, '2023-07-03 08:48:49.952795', '2023-07-03 08:48:49.952795', null);

INSERT INTO targeting (organization_id, toggle_key, environment_key, project_key, status, version, disabled, content,
                       deleted, publish_time, modified_by, created_by, created_time, modified_time, _lock_version)
VALUES (-1, 'FeatureProbe_env_limiter', 'online', 'feature_probe', 'RELEASE', 1, false,
        '{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":0},"variations":[{"value":"-1","name":"unlimited","description":""},{"value":"5","name":"max","description":""}]}',
        false, null, -1, -1, '2023-07-03 08:48:50.094750', '2023-07-03 08:48:50.094750', null);

INSERT INTO targeting (organization_id, toggle_key, environment_key, project_key, status, version, disabled, content,
                       deleted, publish_time, modified_by, created_by, created_time, modified_time, _lock_version)
VALUES (-1, 'demo_features', 'online', 'feature_probe', 'RELEASE', 1, false,
        '{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":0},"variations":[{"value":"false","name":"Open Source","description":""},{"value":"true","name":"Demo","description":""}]}',
        false, null, -1, -1, '2023-07-03 08:48:50.604203', '2023-07-03 08:48:50.604203', null);

INSERT INTO targeting (organization_id, toggle_key, environment_key, project_key, status, version, disabled, content,
                       deleted, publish_time, modified_by, created_by, created_time, modified_time, _lock_version)
VALUES (-1, 'FeatureProbe_toggle_limiter', 'online', 'feature_probe', 'RELEASE', 1, false,
        '{"rules":[],"disabledServe":{"select":0},"defaultServe":{"select":0},"variations":[{"value":"-1","name":"unlimited","description":""},{"value":"10","name":"max","description":""}]}',
        false, null, -1, -1, '2023-07-03 08:48:50.432922', '2023-07-03 08:48:50.432922', null);

