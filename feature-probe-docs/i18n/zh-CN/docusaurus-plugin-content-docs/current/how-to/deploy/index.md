# 部署服务

本文档介绍如何部署 FeatureProbe 服务。

## 部署模式

FeatureProbe 服务架构如下图：

![deploy](/featureprobe_deploy.png)

可根据实际场景选择以下部署方式

### All-in-One 部署

一般用于本地测试或试用，将所有子服务部署在一个部署单元中（容器、虚拟机、物理机），部署步骤简单。

### 子服务docker部署

使用FeatureProbe提供的子服务docker image，部署在单独部署单元中，部署过程稍复杂，灵活性好，子服务可单独扩容。

### 源码编译部署

从源码编译FeatureProbe提供的各个子服务，直接部署或启动本地构建的二进制程序，构建、部署过程复杂，灵活性更高，可以验证源码修改效果。