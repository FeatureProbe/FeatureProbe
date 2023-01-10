---
sidebar_position: 2
---

# API

## Requirements

* JDK 1.8 and above
* Maven can choose the latest version

## Get the source code

:::tip
From version v1.11.1, we have merged the Api service and UI service repository, and the API service package will include UI services,
Local development can directly access the FeatureProbe UI page through the API service root path.
:::

```shell
git clone https://github.com/FeatureProbe/FeatureProbe.git
cd FeatureProbe/api/
```

## Modify configuration

At present, the API service only needs to rely on the external database. Before starting the API service, you need to prepare a Mysql service with version 5.6 and above, and create a library named feature_probe.

Then modify the database configuration in the admin module resources/config/application-online.yml configuration file.

![api_db_config](/api_db_config.png)


## Compile

The api service adopts modular development, and the admin module is responsible for providing web services to the outside. To start the API service, you need to compile the admin module first.

The compilation process will first compile the UI project. If it is the first compilation, it will first install the environment required for the UI compilation in the FeatureProbe/api/node directory. This step mainly install node and yarn. To configure the domestic agent, you can release the comments in the FeatureProbe/api/admin/pom.xml file in the figure below.

![api_maven_mirror](/api_maven_mirror.png)

```shell
cd /admin
mvn clean compile
```

After the compilation is complete, the static files of the UI project will be in the admin module target/classes/static directory

:::note
If you want to turn off the UI compilation option, please set FeatureProbe/api/admin/pom.xml as true .
![skip_compile_ui](/skip_compile_ui.png)
:::

## Local development

After the compilation is complete, run the admin module through your familiar IDE, and visit `http://localhost:8080` to view the UI page.

:::info
If the UI project code changes, the compilation step needs to be re-executed.
:::