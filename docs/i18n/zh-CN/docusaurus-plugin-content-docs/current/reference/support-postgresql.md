---
sidebar_position: 13
---

# PostgreSQL 支持

## 概述

FeatureProbe 从 2.7.0 版本开始支持以 PostgreSQL 作为数据源管理开关数据。

## 如何切换到 PostgreSQL

- **准备一个可用的 PostgreSQL 实例**

- **在 PostgreSQL 中初始化 FeatureProbe 库**

  PostgreSQL 的数据库初始化脚本管理在 [PostgreSQL初始化脚本](https://github.com/FeatureProbe/FeatureProbe/tree/main/api/admin/src/main/resources/db/postgresql) 随着版本的更新，新增的脚本文件将以增量方式进行管理。

  1、部署 FeatureProbe 时的初始化：在部署 FeatureProbe 时，只需执行当前版本号之前的所有脚本文件，以确保数据库处于正确的状态。这将确保数据库按正确的顺序执行所有先前版本的脚本。

  2、版本升级时的初始化：在版本升级时，只需执行增量版本的脚本文件中的 SQL。这将应用新功能和更新，以使数据库与最新版本保持同步。

- **切换到 PostgreSQL**

  1、FeatureProbe 提供了一个postgresql配置文件模版 [application-pg.yml](https://github.com/FeatureProbe/FeatureProbe/tree/main/api/admin/src/main/resources/config/application-pg.yml)

  2、将模版中的数据库实例地址、用户名以及密码更换为自己的配置。

![pg_application_1](/pg_application_1.png)

  3、切换配置为 postgresql, 将 application.yml 中 spring.profiles.active 配置设置为 pg

![pg_application_2](/pg_application_2.png)