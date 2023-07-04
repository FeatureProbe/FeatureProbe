---
sidebar_position: 13
---

# Support for PostgreSQL

## Overview

Starting from version 2.7.0, FeatureProbe supports using PostgreSQL as a data source to manage feature toggle data.

## How to switch to PostgreSQL

- **Prepare a usable PostgreSQL instance**

- **Initialize the FeatureProbe database in PostgreSQL**

  The initialization script for PostgreSQL is managed in [PostgreSQL initialization scripts](https://github.com/FeatureProbe/FeatureProbe/tree/main/api/admin/src/main/resources/db/postgresql). As new script files are added with each version update, they are managed incrementally.

  1、Initialization during FeatureProbe deployment: During the deployment of FeatureProbe, execute all script files up to the current version number to ensure that the database is in the correct state. This ensures that the database executes all previous version scripts in the correct order.

  2、Initialization during version upgrade: During a version upgrade, only execute the SQL statements in the incremental script files. This will apply new features and updates to keep the database synchronized with the latest version.

- **Switching to PostgreSQL**

  1、FeatureProbe provides a PostgreSQL configuration file template called [application-pg.yml](https://github.com/FeatureProbe/FeatureProbe/tree/main/api/admin/src/main/resources/config/application-pg.yml)

  2、Replace the database instance address, username, and password in the template with your own configuration.

![pg_application_1](/pg_application_1.png)

  3、Switch the configuration to PostgreSQL and set the spring.profiles.active configuration in application.yml to pg.

![pg_application_2](/pg_application_2.png)