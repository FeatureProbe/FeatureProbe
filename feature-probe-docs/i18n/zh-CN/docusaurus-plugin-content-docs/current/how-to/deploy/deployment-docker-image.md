---
sidebar_position: 2
---

# Docker image 部署
使用各模块提供的docker 镜象在 Linux/Unix/Mac 独立部署各子服务

## 环境准备

* Docker 17+
* MySQL 5.7+
* 建议：生产环境3个节点及以上
* 建议：2核 CPU/4G内存及以上


## 子服务独立部署

使用各模块提供的 [docker 镜象](https://hub.docker.com/u/featureprobe)在 Linux/Unix/Mac 独立部署。
需要部署有三个服务镜像，如下部署示例：

| 示例机器   | 部署模块            | 端口          |
| ---------- | ------------------- | ------------- |
| 10.100.1.1 | FeatureProbe API    | 4008          |
| 10.100.1.1 | FeatureProbe UI     | 4009（Nginx） |
| 10.100.1.2 | FeatureProbe Server | 4007          |
| 10.100.1.3 | 数据库（MySQL）     | 13306         |

:::tip
上述IP地址请根据实际部署环境替换为实际IP地址，而不是127.0.0.1（Docker默认采用bridge网络模式，并不指向宿主机）
:::

### 操作步骤

1. 运行 MySQL 数据库实例:
   :::tip
   如果使用您已经部署好的其他MySQL环境（可参考[初始化数据库](/reference/database-setup)文档），可以跳过此步骤。在下一步API服务的启动参数中填入您自己的MySQL环境配置信息。
   :::

   ```bash
   docker run -p 13306:13306 \
       -e MYSQL_TCP_PORT=13306 \
       -e MYSQL_ROOT_PASSWORD=root \
       -e MYSQL_DATABASE=feature_probe \
       --name database -d mariadb
   ```

   :::tip
   更详细数据库启动参数配置可以参考 [数据库配置](https://mariadb.com/kb/en/mariadb-docker-environment-variables/)
   :::


2. 运行 FeatureProbe API 实例:

   ```bash
   docker run -p 4008:4008 \
      -e server.port=4008 \
      -e spring.datasource.jdbc-url=jdbc:mysql://10.100.1.4:13306/feature_probe \
      -e spring.datasource.username=root \
      -e spring.datasource.password=root \
      --name featureProbeAPI -d featureprobe/api
      
   # 上述 10.100.1.4:13306 为 MySQL Server 的 IP 和端口，请根据实际情况调整
   ```
   :::info
   API服务更详细的启动参数说明见 [FeatureProbe API 参数说明文档](../../reference/deployment-configuration#featureprobe-api)
   :::
   
3. 运行 FeatureProbe Server 实例:

   ```bash
   docker run -p 4007:4007 \
     -e FP_SERVER_PORT=4007 \
     -e FP_TOGGLES_URL=http://10.100.1.1:4008/internal/server/toggles \
     -e FP_EVENTS_URL=http://10.100.1.1:4008/internal/server/events \
     -e FP_KEYS_URL=http://10.100.1.1:4008/internal/server/sdk_keys \
     --name featureProbeServer -d featureprobe/server
     
   # 上述 10.100.1.1:4008 为 FeatureProbe API 服务 IP 和端口，请根据实际情况调整
   ```
   :::info
   Server服务更详细启动参数说明详见 [FeatureProbe Server 参数说明文档](../../reference/deployment-configuration#featureprobe-server)
   :::

4. 运行 FeatureProbe UI 实例:

   ```bash
   docker run -p 4009:4009 \
   -v /my_custom/default.conf:/etc/nginx/conf.d/default.conf \
   --name featureProbeUI -d featureprobe/ui 
   ```

   为保证 API 和 UI 端口一致(避免请求跨域)，需要自定义 nginx 配置转发 API 请求，`/my_custom/default.conf` 配置如下示例：

   ```nginx
   upstream featureProbeAPI {
        # FeatureProbeAPI 服务的 IP 和端口，请根据实际情况调整
       server 10.100.1.1:4008;
   }
   
   server {
     # 访问的 UI 端口
     listen 4009;  # UI 端口
   
     location / {
       index  index.html index.htm;
       root /usr/share/nginx/html;
       try_files $uri /index.html;
     }
   
      location /api { # 访问 /api 时统一转发到 featureProbeAPI 服务
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

## 部署验证
上述服务启动后打开浏览器，访问：`http://10.100.1.2:4009` (UI服务 IP 和端口)并用以下默认帐号登录试用：

   - username: `admin`
   - password: `Pass1234`
