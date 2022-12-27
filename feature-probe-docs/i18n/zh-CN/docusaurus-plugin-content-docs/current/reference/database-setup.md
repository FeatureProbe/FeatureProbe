---
sidebar_position: 3
---

# 初始化数据库

要运行 FeatureProbe API，您需要运行 MySQL 数据库（MySQL 5.7 或更新版本）。

## 创建数据库

连接到 MySQL Server 后，执行以下 SQL 创建 FeatureProbe 数据库：

```sql
CREATE DATABASE IF NOT EXISTS `feature_probe` /*!40100 DEFAULT CHARACTER SET utf8 */;
```



## 创建表和初始数据

我们提供了两种方式来创建表和初始数据：

### **基于 Flyway 自动创建**

无须特殊配置，FeatureProbe API 原生采用 [flyway](https://flywaydb.org/) 对数据库版本管理和自动创建，在 [gitub](https://github.com/FeatureProbe/feature-probe-api/tree/main/feature-probe-admin/src/main/resources/db/migration) 上你可以看到所有针对数据库的变更 SQL。在您每次启动 FeatureProbe API 时，程序将自动执行 DML/DDL ，无须手工对数据表版本进行维护。

并且，针对数据库的变化您可以查看 `feature_probe.flyway_schema_history` 中的数据。



### **手工导入 DML/DDL **

如果不希望使用 flyway 自动创建表和管理数据库版本，可以获取原生 DML/DDL 实现手工导入创建。

在使用该方式前需要在应用程序中禁用 flyway 的使用，避免产生冲突。在 `feature-probe-api` 启动时增加如下参数来禁用 flyway 的执行：

```bash
--spring.flyway.enabled=false
```

**操作步骤**

**SETP1**: 下载 `feature-probe-api` 代码

```bash
$ git clone https://github.com/FeatureProbe/feature-probe-api.git
```

**SETP2**: 获取 SQL

```bash
$ cd feature-probe-api
$ ls -1 feature-probe-admin/src/main/resources/db/migration/V* \
	| sort -V | xargs cat >> rollup.sql
```

执行完成后将生成 `rollup.sql` 文件，里面包含了所有 DML 和 DDL。

**SETP3**: 导入 SQL

将生成的 `rollup.sql` 导入到 `feature_probe` 库中即可。

```
mysql> use feature_probe;
mysql> source ./rollup.sql;
```

导入完成后使用 `show tables` 可以看到所有表结构：

```bash
mysql> show tables;
+---------------------------+
| Tables_in_feature_probe |
+---------------------------+
| access_token              |
| approval_record           |
| attribute                 |
| dictionary                |
| environment               |
| targeting_segment         |
| webhook_settings          |
...
```

:::tip
建议使用基于 Flyway 方式来自动维护数据库，手工导入 DML/DDL 方式将导致后续无法对表结构进行自动化升级，需要手工维护版本。
:::

