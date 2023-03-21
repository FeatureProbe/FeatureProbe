---
sidebar_position: 3
---

# All In One 部署

> 本文档介绍如何All In One部署（所有服务都在一个容器中）FeatureProbe 服务。

## 环境准备

* Docker 17+
* Mysql 5.7+
* 建议：2核 CPU/4G内存及以上

## 部署

使用 Dokcer快速在 Linux/Unix/Mac 上运行。

**操作步骤：**

1. 创建FeaturePorbe数据库

   部署All-In-One的FeaturePorbe服务前，需要先在准备的数据库服务中创建所需要的库。
   
   ```bash
   CREATE DATABASE IF NOT EXISTS feature_probe;
   CREATE DATABASE IF NOT EXISTS feature_probe_events;
   ```

2. 启动FeaturePorbe容器

   ```bash
   docker run  -p 4008:4008 -p  4006:4006 -p 4007:4007 -p 4011:4011 \
   -e api_server_port=4008 \
   -e api_spring_profiles_active=online \
   -e API_JVM_ARGS='-Xmx2048m -Xms2048m' \
   -e spring.datasource.jdbc-url=jdbc:mysql://172.24.141.155:13306/feature_probe \
   -e spring.datasource.username=root \
   -e spring.datasource.password=root \
   -e app.server-base-urls=http://127.0.0.1:4007 \
   -e app.analysis-base-url=http://127.0.0.1:4006 \
   -e analysis_server_port=4006 \
   -e app.datasource.jdbcUrl=jdbc:mysql://172.24.141.155:13306/feature_probe_events \
   -e app.datasource.username=root \
   -e app.datasource.password=root \
   -e analysis_spring_profiles_active=online \
   -e ANALYSIS_JVM_ARGS='-Xmx2048m -Xms2048m' \
   -e RUST_LOG=info \
   -e FP_SERVER_PORT=4007 \
   -e FP_TOGGLES_URL=http://127.0.0.1:4008/internal/server/toggles \
   -e FP_EVENTS_URL=http://127.0.1.0:4008/internal/server/events \
   -e FP_KEYS_URL=http://127.0.0.1:4008/internal/server/sdk_keys \
   -e FP_ANALYSIS_URL=http://127.0.0.1:4006/events \
   -e FP_REFRESH_SECONDS=10 \
   -e FP_REALTIME_PORT=4011 \
   -e TZ=Asia/Shanghai \
   --name featureProbeAll -d featureprobe/featureprobe 
   ```

   :::info
   spring.datasource.jdbc-url 为API服务数据库，需替换为自己准备好的数据库地址。

   app.datasource.jdbcUrl     为Analysis服务数据库，需替换为自己准备好的数据库地址。
   :::


3. docker启动成功后，打开浏览器，访问：`http://localhost:4008`，并用以下默认帐号登录试用：
   - username: `admin`
   - password: `Pass1234`