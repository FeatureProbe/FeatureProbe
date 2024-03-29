---
sidebar_position: 7
---

# 集群部署

本文档介绍如何以多集群方式部署 FeatureProbe 服务。

## 部署拓扑

为保证整体服务的高可用，我们推荐部署拓扑结构如下：

![image-20220906181332418](/deploy.png)

一套独立的 FeatureProbe 集群由三部分组成：

- Admin 集群

  一个 Admin 服务由 UI（Nginx） 和 API 模块组成。该集群可通过*域名*或 *VIP* 方式负载均衡机制

- Server 集群

  依赖 API 服务，需访问同集群下的 Admin 集群中的 API 服务。该服务为 SDK 提供开关执行和下发能力，建议以*域名*方式对外提供访问

- 数据库集群

  建议可使用一主多从集群模式。

**网络策略**

- 将 Admin 集群和数据库控制仅在内网访问，不建议暴露在公网上。
- Server 集群需为 APP SDK 和 JS SDK 提供开关执行能力，所以需要能在公网访问。如仅使用 Server SDK 接入则无须暴露在公网中。



## 多环境

FeatureProbe 本身提供了多环境支持，不同环境之间数据采用逻辑隔离方式，所以无须为不同环境部署独立环境。

> 关于对多环境的支持和自定义环境，可以参考[项目与环境](/how-to/platform/project-and-environment)

