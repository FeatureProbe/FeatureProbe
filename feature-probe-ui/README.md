# FeatureProbe UI

FeatureProbe applications suite includes a customer UI/Portal. It is optional to install, 
but we highly recommend using it as the management portal. 

The FeatureProbe UI provides extensive UI features for managing and updating properties, 
rollout, rollback, configuration peer reviews, permission management, history, and many other features.

## [中文文档](https://docs.featureprobe.io/zh-CN/)

## Getting Started


We provide an off-the-shelf UI for FeatureProbe. 
You can boot up it within a minute by running the Docker-compose file or the Docker Image we provide here.
You can also customize the original UI with your own idea, 
or even build your own UI and connect it with FeatureProbe API. Here are several approaches to set up a UI.


### Using Docker Composer to Install UI and other Main Services Together

We recommend booting up UI along with other core components by using a docker composer file. 

Here is an example to help to boot up FeatureProbe Server, API, UI and db with a simple docker-compose up command.
Check it out at [FeatureProbe Official Compose File](https://github.com/FeatureProbe/featureprobe).

Or you can simply run below command to clone and boot up the Docker composer components.
``` bash
git clone https://github.com/FeatureProbe/featureprobe.git
cd featureprobe
docker compose up
```


### Installing UI Independently with a Docker Image

You can alternatively install and run UI with a Docker image. To run, binding the exposed port 8081 to the host, use:
```
$ docker run -d -p 8081:8081 --name fp-ui featureprobe/ui
```

### Installing UI Independently with yarn or npm

You can alternatively install and run UI with yarn or npm, Check it out at docs: [How to install UI](https://docs.featureprobe.io/how-to/develop/ui-local-develop). 
[中文版](https://docs.featureprobe.io/zh-CN/how-to/develop/ui-local-develop)


### Building a customized UI on top of the original one
If you would like to customize the original UI of FeatureProbe, you can clone or folk a copy of this repository
and do your own coding and building.


## Contributing
We are working on continue evolving FeatureProbe core, making it flexible and easier to use. 
Development of FeatureProbe happens in the open on GitHub, and we are grateful to the 
community for contributing bugfixes and improvements.

Please read [CONTRIBUTING](https://github.com/FeatureProbe/featureprobe/blob/master/CONTRIBUTING.md) 
for details on our code of conduct, and the process for taking part in improving FeatureProbe.


## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
