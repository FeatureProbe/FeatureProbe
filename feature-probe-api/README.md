# FeatureProbe API

[![codecov](https://codecov.io/gh/FeatureProbe/feature-probe-api/branch/main/graph/badge.svg?token=JVJWQUUIJH)](https://codecov.io/gh/FeatureProbe/feature-probe-api)
[![Docker Pulls](https://img.shields.io/docker/pulls/featureprobe/api)](https://hub.docker.com/u/featureprobe)
[![Apache-2.0 license](https://img.shields.io/github/license/FeatureProbe/FeatureProbe)](https://github.com/FeatureProbe/FeatureProbe/blob/main/LICENSE)

FeatureProbe supports an extensive API so that other services or clients can use it programmatically.
This API is exposed using the standard REST architecture in a secure, uniform, stateless manner.

FeatureProbe API is one of the key components of the whole system. You must install it to set up Feature Probe services.
We provide a docker composer configuration as an example to make it easier to set up all the services together including
API;
or you can choose to run API as a docker container and boot other services one by one.

## [中文文档](https://docs.featureprobe.io/zh-CN/)

## Getting Started

### Using Docker Composer to Install Main Services

We recommend booting up UI along with other core components by using a docker composer file.

Here is an example to help to boot up FeatureProbe Server, API, UI and db with a simple docker-compose up command.
Check it out at [FeatureProbe Official Compose File](https://github.com/FeatureProbe/featureprobe).

Or you can simply run below command to clone and boot up the Docker composer components.

``` bash
git clone https://github.com/FeatureProbe/featureprobe.git
cd featureprobe
docker compose up
```

### Installing API Independently with a Docker Image

You can alternatively install and run API with a Docker image. To run, binding the exposed port 4007 to the host, use:

```
$ docker run -d -p 4007:4007 --name fp-api featureprobe/api
```

Remember to add the environment variables for connecting an RDS database, like

```angular2svg
spring.datasource.jdbc-url=jdbc:mysql://database:13306/feature_probe?useSSL=false&characterEncoding=utf8&autoReconnect=true&failOverReadOnly=false&rewriteBatchedStatements=TRUE&useSSL=false&serverTimezone=Asia/Shanghai
```

### Building jar Package and Running it on a VM or Server

You can also choose to build the project and generate the package use Maven.

```
git clone https://github.com/FeatureProbe/feature-probe-api.git
mvn clean package
```

If everything checks out, the jar package should be available in the target folder.
You can deploy it as you wish to.

```
java -jar feature-probe-api-1.0-SNAPSHOT.jar
```

### Building your own Image and Installing

In most cases, the settings from the environment are used to populate the application configuration on the container
startup.
However, in some cases you may wish to customise the settings in ways that are not supported by the environment
variables above.
There are two main ways of doing this; modify our repository to your own image, build a new image from the existing one.
We will briefly outline these methods here, but in practice how you do this will depend on your needs.

#### Building your own image

* Clone the FeatureProbe API repository at https://github.com/FeatureProbe/feature-probe-api.git
* Modify codes as you wish.
* Build the new image with e.g: docker build --tag my-featureprobe-api
* Optionally push to a registry, and deploy.

#### Build a new image from the existing one

* Create a new Dockerfile, which starts with the line e.g: FROM featureprobe/api:latest.
* Add some commands.
* Build, push and deploy the new image as above.

## API Endpoints

Checkout the API endpoints at `http://localhost:4009/api-docs` after you boot up the service locally with the
Docker Composer file.
You may need to modify the host address and port if you deploy the services in a different way.

## Contributing

We are working on continue evolving FeatureProbe core, making it flexible and easier to use.
Development of FeatureProbe happens in the open on GitHub, and we are grateful to the
community for contributing bugfixes and improvements.

Please read [CONTRIBUTING](https://github.com/FeatureProbe/featureprobe/blob/master/CONTRIBUTING.md)
for details on our code of conduct, and the process for taking part in improving FeatureProbe.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

