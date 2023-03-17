---
sidebar_position: 3
---

# All In One Deploy Guide

> This document describes how to deploy the FeatureProbe service using an All-In-One deployment method, where all services are contained within a single container.

## Environment Preparation

* Docker 17+
* Mysql 5.7+
* Recommendation: 2-core CPU/4G memory and above

## Deploy

Running with Docker on Linux/Unix/Mac

**Setps:**

1. Creating FeatureProbe Database

   Before deploying the All-In-One FeatureProbe service, you need to create the required database in the prepared database service.
   
   ```bash
   CREATE DATABASE IF NOT EXISTS feature_probe;
   CREATE DATABASE IF NOT EXISTS feature_probe_events;
   ```

2. Starting FeatureProbe Container

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
   The "spring.datasource.jdbc-url" parameter is for the API service database. Please replace it with your own prepared database address.
   
   The "app.datasource.jdbcUrl" parameter is for the Analysis service database. Please replace it with your own prepared database address.
   :::


3. Go to UI/Portal at `http://localhost:4008` and use the default credentials to log in.
   - username: `admin`
   - password: `Pass1234`