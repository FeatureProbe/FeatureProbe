---
sidebar_position: 8
---

# Deployment Configuration

The following is the description of the parameters of the API module and Server module at startup.

## FeatureProbe API

| **Environment variable**                | **Default value** | Required | **Description**                                              |
| --------------------------------------- | ----------------- | -------- | ------------------------------------------------------------ |
| server.port                             | 8080              | no       | Server port                                                     |
| TZ                                      | Asia/Shanghai     | no       | Timezone                                                         |
| spring.datasource.jdbc-url              | -                 | yes       |  Connection address of JDBC. Such as `jdbc:mysql://database:13306/feature_probe` |
| spring.profiles.active                  | online            | no       | Currently active profile                                           |
| logging.level.root                      | INFO              | no       | Application log level: `INFO`/`ERROR`/`WARN`/`DEBUG`                  |
| spring.jpa.show-sql                     | false             | no       | Whether to display the SQL statement at execution time                                    |
| app.security.jwt.keystore-location      | ./jwt.jks         | no       | Certificate file path                                                 |
| app.security.jwt.keystore-password      | password          | no       | Storepass when generating the certificate                                         |
| app.security.jwt.private-key-passphrase | password          | no       | Keypass when generating the certificate                                        |
| app.analysis-url |    http://127.0.0.1:4006       | no       |  Analysis Server URL                          |
| server-base-urls | http://127.0.0.1:4007          | no       |  Server URLs;           Multiple URLs, separated by commas            |

*The above parameters use the docker method to start the program and pass it in through Environment, such as starting it with a jar package and passing it in through java -D.*

### Security authentication configuration

FeatureProbe API is used as the management background, using [JWT](https://jwt.io/) standard protocol for user login authentication, and using [RSA256](https://de.wikipedia.org/wiki/RSA-Kryptosystem) encryption Algorithmic signature. For security reasons, it is strongly recommended to regenerate the RSA key file.

Key generation method:

```bash
keytool -genkey -alias my-featureprobe-jwt -keyalg RSA -keysize 1024 -keystore fp-jwt.jks -validity 365 -keypass YOU-PRIVATE-KEY-PASSPHRASE -storepass YOU-KEYSTORE-PASSWORD
```

After the execution is completed, the `fp-jwt.jks` file will be generated in the current directory. The parameter description:

- validity - Certificate valid days
- keypass - *YOU-PRIVATE-KEY-PASSPHRASE*
- storepass - *YOU-KEYSTORE-PASSWORD*

After the certificate is generated, you need to modify the enabling parameters `app.security.jwt.*` to make the current certificate take effect in the application.

## FeatureProbe Server

| **Environment variable** | **Default value**                         | Required | **Description**                                        |
| ------------------------ | ----------------------------------------- | -------- | ------------------------------------------------------ |
| FP_SERVER_PORT           | 4007                                      | no       | Server port                                               |
| FP_TOGGLES_URL           | http://127.0.0.1:8080/api/server/toggles  | yes       | Service address to connect to FeatureProbe API. Used for pull toggles         |
| FP_KEYS_URL              | http://127.0.0.1:8080/api/server/sdk_keys | yes       | Service address to connect to FeatureProbe API. Used for pull sdk key     |
| FP_EVENTS_URL            | http://127.0.0.1:8080/api/server/events   | yes       | Service address to connect to FeatureProbe API. Used to report toggle access events |
| FP_ANALYSIS_URL          |  -   | yes       | Analysis Server URL，Used to report toggle events|
| FP_REFRESH_SECONDS       | 3                                         | no       | Interval of polling pull toggle                                    |
| RUST_LOG                 | info                                      | no       | Application log level, `info`/`error`                          |

*Whether the above parameters are started in docker mode or binary mode, they are all passed in through Environment.*
