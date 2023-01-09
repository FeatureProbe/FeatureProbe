# FeatureProbe Server

[![Top Language](https://img.shields.io/github/languages/top/FeatureProbe/server-sdk-rust)](https://github.com/FeatureProbe/feature-probe-server/search?l=rust)
[![codecov](https://codecov.io/gh/featureprobe/feature-probe-server/branch/main/graph/badge.svg?token=TAN3AU4CK2)](https://codecov.io/gh/featureprobe/feature-probe-serve)
[![Github Star](https://img.shields.io/github/stars/FeatureProbe/server-sdk-rust)](https://github.com/FeatureProbe/server-sdk-rust/stargazers)
[![Apache-2.0 license](https://img.shields.io/github/license/FeatureProbe/FeatureProbe)](https://github.com/FeatureProbe/FeatureProbe/blob/main/LICENSE)

## [中文文档](https://docs.featureprobe.io/zh-CN/)

FeatureProbe Server(also called the Evaluation Server) is a key component to make the FeatureProbe service workable. 
It provides toggle configurations and rules to the server-side SDKs, 
and it provides evaluation results to the client-side SDKs.

![featureProbe Architecture](https://github.com/FeatureProbe/featureprobe/blob/main/pictures/feature_probe_architecture.png)

The Evaluation Server directly/indirectly decides variation results based on the targeting user's situation and makes
the gradually rolling out, service degradation or A/B testing possible.


## Getting Started
Installing the Evaluation Service is the prerequisite of running FeatureProbe service.

### Using Docker Composer to Install Main Services

We recommend booting up the Evaluation Server along with other core components by using a docker composer file. 

Here is an example to help to boot up FeatureProbe Server, API, UI and db with a simple docker-compose up command.
Check it out at [FeatureProbe Official Compose File](https://github.com/FeatureProbe/featureprobe).

Or you can simply run below command to clone and boot up the Docker composer components.
``` bash
git clone https://github.com/FeatureProbe/featureprobe.git
cd featureprobe
docker compose up
```

### Installing Evaluation Server Independently with a Docker Image

You can alternatively install and run API with a Docker image. To run, binding the exposed port 4007 to the host, use:
```
$ docker run -d -p 4007:4007 --name fp-api featureprobe/server
```



## Contributing
We are working on continue evolving FeatureProbe core, making it flexible and easier to use.
Development of FeatureProbe happens in the open on GitHub, and we are grateful to the
community for contributing bugfixes and improvements.

Please read [CONTRIBUTING](https://github.com/FeatureProbe/featureprobe/blob/master/CONTRIBUTING.md)
for details on our code of conduct, and the process for taking part in improving FeatureProbe.


## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

