---
sidebar_position: 2
---

# Docker Deploy Guide
> Use the docker image provided by each module to independently deploy each sub-service on Linux/Unix/Mac

## Requirements

* Docker 17+
* MySQL 5.7+
* Recommendation: Production environment with 3 nodes and above
* Recommendation: 2-core CPU/4G memory and above

## Independent deployment of sub-services

Deploy independently on Linux/Unix/Mac using the [docker image](https://hub.docker.com/u/featureprobe) provided by each module.

Three service images need to be deployed, as shown in the following deployment example:

| Sample machine   | Deployment module     | Port          |
| ---------- | ------------------- | ------------- |
| 10.100.1.1 | FeatureProbe API    | 4008          |
| 10.100.1.1 | FeatureProbe UI     | 4009（Nginx） |
| 10.100.1.2 | FeatureProbe Server | 4007 4011     |
| 10.100.1.3 | Database (MySQL)     | 13306         |

:::tip
Please replace the above IP address with the actual IP address according to the actual deployment environment instead of 127.0.0.1 (Docker uses the bridge network mode by default and does not point to the host)
:::


### Steps


1. Run the MySQL database instance:
   :::tip
   If you use other MySQL environments that you have already deployed (refer to [Setup database](/reference/database-setup)), you can skip this step. Fill in your own MySQL environment configuration information in the startup parameters of the API service in the next step.
   :::

   ```bash
   docker run -p 13306:13306 \
       -e MYSQL_TCP_PORT=13306 \
       -e MYSQL_ROOT_PASSWORD=root \
       -e MYSQL_DATABASE=feature_probe \
       --name database -d mariadb
   ```

   :::tip
      For more detailed configuration of database startup parameters, please refer to [Configure database](https://mariadb.com/kb/en/mariadb-docker-environment-variables/)
   :::


2. Run the FeatureProbe API instance:

   ```bash
   docker run -p 4008:4008 \
      -e server.port=4008 \
      -e spring.datasource.jdbc-url=jdbc:mysql://10.100.1.4:13306/feature_probe \
      -e spring.datasource.username=root \
      -e spring.datasource.password=root \
      -e app.analysis-url=http://10.100.1.1:4006
      -e app.server-base-urls=http://10.100.1.1:4009
      --name featureProbeAPI -d featureprobe/api
      
   # The above 10.100.1.4:13306 is the IP and port of MySQL Server, please adjust it according to the actual situation
   # The above 10.100.1.4:4006 is the IP and port of Analysis Server, please adjust it according to the actual situation
   # The above 10.100.1.4:4009 is the IP and port of Server, please adjust it according to the actual situation
   ```

   :::info
   For a more detailed description of the startup parameters of the API service, see [FeatureProbe API parameters](../../reference/deployment-configuration#featureprobe-api)
   :::


3. Run the FeatureProbe Server instance:

   ```bash
   docker run -p 4007:4007 -p 4011:4011 \
     -e FP_SERVER_PORT=4007 \
     -e FP_REALTIME_PORT=4011 \
     -e FP_TOGGLES_URL=http://10.100.1.1:4008/internal/server/toggles \
     -e FP_EVENTS_URL=http://10.100.1.1:4008/internal/server/events \
     -e FP_KEYS_URL=http://10.100.1.1:4008/internal/server/sdk_keys \
     -e FP_ANALYSIS_URL=http://10.100.1.1:4006/events \
     --name featureProbeServer -d featureprobe/server
     
   # The above 10.100.1.1:4008 is FeatureProbe API service IP and port, please adjust according to the actual situation
   # The above 10.100.1.1:4006 is FeatureProbe Analysis service IP and port, please adjust according to the actual situation
   ```

   :::info
   For a more detailed description of the startup parameters of the Server service, see  [FeatureProbe Server parameters](../../reference/deployment-configuration#featureprobe-server)
   :::

4、Run the FeatureProbe Analysis instance:

:::info
The Analysis service database and the API database are separated. Before running Analysis, please create a database named 'feature_probe_events'. You can use the same database service as mentioned above.
:::

   ```shell
   CREATE DATABASE IF NOT EXISTS feature_probe_events;
   ```

   ```bash
   docker run -p 4006:4006 \
	   -e server.port=4006 \
	   -e app.datasource.jdbcUrl=jdbc:mysql://10.100.1.4:13306/feature_probe_events \
	   -e app.datasource.username=root \
	   -e app.datasource.password=fp@root \
	   -e spring.profiles.active=online \
	   -e JVM_ARGS='-Xmx2048m -Xms2048m' \
	   -e TZ=Asia/Shanghai \
	   --name featureProbeAnalysis -d featureprobe/analysis
     
   # The above 10.100.1.4:13306 is the IP and port of MySQL Server, please adjust it according to the actual situation
   ```

5. Run the FeatureProbe UI instance:

   ```bash
   docker run -p 4009:4009 \
   -v /my_custom/default.conf:/etc/nginx/conf.d/default.conf \
   --name featureProbeUI -d featureprobe/ui 
   ```

   In order to ensure that the API and UI ports are consistent (to avoid cross-domain requests), it is necessary to customize the nginx configuration to forward API requests. The configuration of `/my_custom/default.conf` is as follows:

   ```nginx
   upstream featureProbeAPI {
      # IP and port of FeatureProbe API service, please adjust according to the actual situation
      server 10.100.1.1:4008;
   }
   
   server {
      listen 4009;  # UI service port
   
      location / {
         index  index.html index.htm;
         root /usr/share/nginx/html;
         try_files $uri /index.html;
      }
   
      location /api { # Unified forwarding to featureProbe API service when accessing /api
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-NginX-Proxy true;
         proxy_pass http://featureProbeAPI/api;
         proxy_ssl_session_reuse off;
         proxy_set_header Host $http_host;
         proxy_cache_bypass $http_upgrade;
         proxy_redirect off;
      }
   }
   ```

## Deployment verification
After the above services are started, open the browser, visit: `{FeatureProbeUI_IP}:4009` and log in with the following default account to try it out:

   - username: `admin`
   - password: `Pass1234`
