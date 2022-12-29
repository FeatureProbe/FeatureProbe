---
sidebar_position: 2
---

# Docker Deploy Guide

> This document describes how to deploy the FeatureProbe service.


## Requirements

* Docker 17+

* MySQL 5.7+

* Recommendation: Production environment with 3 nodes and above

- Recommendation: 2-core CPU/4G memory and above

## Deploy FeatureProbe Service

### Docker image

Deploy independently on Linux/Unix using the [docker image](https://hub.docker.com/u/featureprobe) provided by each module. There are three services that need to be deployed, namely FeatureProbe UI, FeatureProbe Server and FeatureProbe API.

**Setps：**

1. Create a private network connection: `docker network create featureProbeNet`

2. Run the MySQL database instance:

   ```bash
   docker run -e  MYSQL_ROOT_PASSWORD=root -e \
     MYSQL_DATABASE=feature_probe \
     MYSQL_TCP_PORT=3306 \
     --network featureProbeNet --name database -d mariadb
   ```

3. Run the FeatureProbe API instance:

   ```bash
   docker run -e server.port=4008 -e \
     spring.datasource.jdbc-url=jdbc:mysql://database:13306/feature_probe \
     spring.datasource.jdbc-url=3306 \
     --network featureProbeNet --name backendAPI -d featureprobe/api
   ```

4. Run the FeatureProbe Server instance:

   ```bash
   docker run -e FP_SERVER_PORT=4007 -e \
     FP_TOGGLES_URL=http://backendAPI:4008/internal/server/toggles \
     FP_EVENTS_URL=http://backendAPI:4008/internal/server/events \
     FP_KEYS_URL=http://backendAPI:4008/internal/server/sdk_keys \
     --network featureProbeNet --name serverAPI -d featureprobe/server
   ```

5. Run the FeatureProbe UI instance:

   ```bash
   docker run -e FP_SERVER_PORT=4007 -e \
     --network featureProbeNet --name ui -d featureprobe/ui
   ```

6. After the above services are started, open the browser, visit: `{FeatureProbeUI_IP}:4009` and log in with the following default account to try it out:

   - username: `admin`

   - password: `Pass1234`



