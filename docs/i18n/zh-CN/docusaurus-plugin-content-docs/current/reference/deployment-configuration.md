---
sidebar_position: 5
---

# 部署参数说明

API 模块和 Server 模块在启动时参数说明。

## FeatureProbe API

| **Environment variable**                | **Default value** | Required | **Description**                                              |
| --------------------------------------- | ----------------- | -------- | ------------------------------------------------------------ |
| spring.datasource.jdbc-url              | -                 | 是       | JDBC 连接地址。示例：` jdbc:mysql://{database_ip:port}/{database_name}` |
| spring.datasource.username              | root              | 否       | 连接数据库用户名                                             |
| spring.datasource.password              | root              | 否       | 连接数据库密码                                               |
| server.port                             | 8080              | 否       | 服务端口                                                     |
| TZ                                      | Asia/Shanghai     | 否       | 时区                                                         |
| spring.profiles.active                  | online            | 否       | 当前生效的 profile                                           |
| logging.level.root                      | INFO              | 否       | 应用日志级别； `INFO`/`ERROR`/`WARN`/`DEBUG                  |
| spring.jpa.show-sql                     | false             | 否       | 是否显示执行时的 SQL 语句                                    |
| app.security.jwt.keystore-location      | ./jwt.jks         | 否       | 证书文件路径                                                 |
| app.security.jwt.keystore-password      | password          | 否       | 生成证书时 storepass                                         |
| app.security.jwt.private-key-passphrase | password          | 否       | 生成证书时的 keypass                                         |

*上述参数使用 docker 方式启动程序通过 Environment 传入，如以 jar 包启动通过 java ` --` 传入.*

### 安全认证配置

FeatureProbe API 作为管理后台，对用户登录认证采用 [JWT](https://jwt.io/) 标准协议，并使用 [RSA256](https://de.wikipedia.org/wiki/RSA-Kryptosystem) 加密算法签名。为保证安全性，强烈建议重新生成 RSA 密钥文件。

密钥生成方式：

```bash
keytool -genkey -alias my-featureprobe-jwt -keyalg RSA -keysize 1024 -keystore fp-jwt.jks -validity 365 -keypass YOU-PRIVATE-KEY-PASSPHRASE -storepass YOU-KEYSTORE-PASSWORD
```

执行完成后会在当前目录下生成 `fp-jwt.jks` 文件，参数说明：

- validity - 证书有效天数
- keypass - *YOU-PRIVATE-KEY-PASSPHRASE*
- storepass - *YOU-KEYSTORE-PASSWORD*

证书生成后，需要修改启用参数 `app.security.jwt.*` 来让当前证书在应用程序中生效。

## FeatureProbe Server

| **Environment variable** | **Default value**                         | Required | **Description**                                        |
| ------------------------ | ----------------------------------------- | -------- | ------------------------------------------------------ |
| FP_TOGGLES_URL           | http://127.0.0.1:8080/api/server/toggles  | 是       | 连接的 FeatureProbe API 服务地址；用于拉取开关         |
| FP_KEYS_URL              | http://127.0.0.1:8080/api/server/sdk_keys | 是       | 连接的 FeatureProbe API 服务地址；用于拉取 sdk key     |
| FP_EVENTS_URL            | http://127.0.0.1:8080/api/server/events   | 是       | 连接的 FeatureProbe API 服务地址；用于上报开关访问事件 |
| FP_SERVER_PORT           | 4007                                      | 否       | 服务端口                                               |
| FP_REFRESH_SECONDS       | 3                                         | 否       | 轮训拉取开关间隔时间                                   |
| RUST_LOG                 | info                                      | 否       | 应用日志级别;  `info`/`error`                          |

*上述参数无论是以 docker 方式或二进制方式启动，均通过 Environment 传入.*

