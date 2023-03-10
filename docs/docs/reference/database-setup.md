---
sidebar_position: 6
---

# Setup database

To run the FeatureProbe API, you need to be running a MySQL database (MySQL 5.7 or newer).

## Create database

After connecting to MySQL Server, execute the following SQL to create the FeatureProbe database:

```sql
CREATE DATABASE IF NOT EXISTS `feature_probe` /*!40100 DEFAULT CHARACTER SET utf8 */;
```

## Create table and initial data

We provide two ways to create tables and initial data:

### **Automatically created based on Flyway**

No special configuration is required, the FeatureProbe API natively uses [flyway](https://flywaydb.org/) to manage and automatically create the database version, in [gitub](https://github.com/FeatureProbe/FeatureProbe/tree/main/api/admin/src/main/resources/db/migration) you can see all the change SQL for the database. Every time you start FeatureProbe API, the program will automatically execute DML/DDL, no need to manually maintain the version of the data table.

Also, you can view the data in `feature_probe.flyway_schema_history` for database changes.

### ** Manually import DML/DDL **

If you do not want to use flyway to automatically create tables and manage database versions, you can obtain native DML/DDL to implement manual import and creation.

Before using this method, you need to disable the use of flyway in the application to avoid conflicts. Add the following parameter to disable flyway execution when `api` starts:

```bash
--spring.flyway.enabled=false
```

#### **Steps**

**SETP1**: Clone `api` code

```bash
$ git clone https://github.com/FeatureProbe/FeatureProbe.git
```

**SETP2**: Get SQL

```bash
$ cd api
$ ls -1 admin/src/main/resources/db/migration/V* \
| sort -V | xargs cat >> rollup.sql
```

After the execution is complete, the `rollup.sql` file will be generated, which contains all DML and DDL.

**SETP3**: Import SQL

Import the generated `rollup.sql` into the `feature_probe` library.

```
mysql> use feature_probe;
mysql> source ./rollup.sql;
```

After the import is complete, use `show tables` to see all table structures:

```bash
mysql> show tables;
+---------------------------+
|Tables_in_feature_probe|
+---------------------------+
| access_token |
| approval_record |
| attribute |
| dictionary |
| environment |
|targeting_segment|
| webhook_settings |
...
```

:::tip
It is recommended to use the flyway to automatically maintain the database. Manually importing DML/DDL will result in the inability to automatically upgrade the table structure in the future, and manual maintenance of the version is required.
:::