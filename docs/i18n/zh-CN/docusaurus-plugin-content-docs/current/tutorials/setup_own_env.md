---
sidebar_position: 2
---

# 搭建自己的环境

我们将带你在你自己的服务器资源上搭建FeatureProbe，这样你可以拥有一个自己私有的环境来体验FeatureProbe的功能，您也可以通过这个私有环境直接管理您的线上服务。

这个教程假设您了解最基本git操作，以及了解基本的docker原理，并且拥有自己的机器资源，适合有一定技术背景的用户学习。

## 工具环境准备

1. 首先确保您的服务器连接了网络。
2. 安装[git](https://git-scm.com/) 
3. 安装[docker](https://www.docker.com/) 
4. 国内网络访问docker hub会比较慢，需要添加[国内镜像](https://gitee.com/featureprobe/FeatureProbe/blob/main/DOCKER_HUB.md)

## 安装启动FeatureProbe

1. 用git下载最新版本FeatureProbe代码
~~~bash
bash:> git clone https://gitee.com/featureprobe/FeatureProbe.git
~~~
2. 使用docker composer拉取镜像并启动
~~~bash
bash:> cd FeatureProbe
bash:> docker compose up
~~~
3. 等待镜像拉取，视网络状况，可能需要5-10min
4. 等待镜像启动，大约1min左右，启动成功后命令行可以看到日志滚动。也可在docker GUI工具中查看镜像启动状况，全部绿色即为启动成功：
![docker startup](/docker_startup.png)

:::info
FeatureProbe包含5个独立镜像，需要这5个镜像全部启动成功后才能正常运行。如某个未启动成功可以在docker GUI中单独重启未成功的镜像。
:::

## 验证安装结果

打开浏览器，访问 [http://localhost:4009](http://localhost:4009) ，可以看到以下登录页面：
![login](/docker_login.png)

使用默认帐号登录：
* `username`: admin
* `password`: Pass1234

登录后即可看到4个内置开关，并开始试用了。
![toggle list](/docker_toggle_list_cn.png)

:::info
4个内置开关为了用户参考各种典型的开关配置，用户可根据自己需要选择保留或删除，不影响平台使用
:::
