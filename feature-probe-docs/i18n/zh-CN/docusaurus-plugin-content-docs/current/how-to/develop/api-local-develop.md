---
sidebar_position: 2
---

# feature-probe-api

环境要求 JDK 1.8 以及以上版本。
Maven 选择当前最新版本即可。

### 获取源码

:::tip
从 1.11.1 版本开始, 我们对Api服务和UI服务仓库进行了合并，API服务打包会包含UI服务，
本地开发直接可通过API服务根路径访问FeatureProbe管理页面
:::

```shell
git clone https://github.com/FeatureProbe/FeatureProbe.git
cd FeatureProbe/feature-probe-api/
```

### 配置修改

目前API服务只需要依赖外部数据库，启动API服务前需要准备一个版本在 5.6 及以上的 Mysql 服务，并创建一个名为 feature_probe 库。
然后修改 feature-probe-admin模块 resources/config/application-online.yml 配置文件中数据库配置。

![api_db_config](/api_db_config.png)


### 编译

api服务采用模块化开发，feature-probe-admin模块负责对外提供Web服务。启动API服务需要先编译feature-probe-admin模块
编译过程会先编译UI前端项目，如果是初次编译，会先在 FeatureProbe/feature-probe-api/node 目录下安装前端编译所需的环境。
主要是安装 node 以及 yarn。 配置国内代理可放开下图 FeatureProbe/feature-probe-api/feature-probe-admin/pom.xml 文件注释。

![api_maven_mirror](/api_maven_mirror.png)

```shell
cd /feature-probe-admin
mvn clean compile
```

编译完成后UI项目的静态文件会在 feature-probe-admin 模块target/classes/static 目录下

:::note
如果想关闭关闭UI编译选项，请将 FeatureProbe/feature-probe-api/feature-probe-admin/pom.xml 如下配置置为 true .
![skip_compile_ui](/skip_compile_ui.png)
:::



### 本地开发

编译完成后，通过自己熟悉的IDE运行 feature-probe-admin 模块，访问 http://localhost:8080 查看UI页面。

:::info
如果UI项目代码变动，需要重新执行编译步骤。
:::

