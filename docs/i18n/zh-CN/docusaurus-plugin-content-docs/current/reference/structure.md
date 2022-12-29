---
sidebar_position: 1
---

# 总体架构设计

下图是  FeatureProbe 的整体架构模块的概览：

![featureprobe architecture](/structure.png)

主要由如下模块组成：

- **FeatureProbe UI**  - 为用户提供可视化的功能开关管理和发布的 UI 界面。
- **FeatureProbe API** - 为 UI 提供数据管理功能和对外的 Open API 服务。API 设计严格遵守 [Restful 规范](https://www.redhat.com/zh/topics/api/what-is-a-rest-api)，同时作为功能管理领域通用 API 不仅为 UI 提供了核心数据管理能力，你也可基于该 API 实现开关规则自动变更和发布。[查看 OpenAPI 文档](https://featureprobe.io/api-docs)
- **FeatureProbe Server** - 提供高性能的开关规则判定引擎和秒级的数据分发能力。
- **FeatureProbe SDK** - 我们为所有主流语言提供获取开关规则判定结果的 SDK，能够让你在应用程序中快速接入 FeatureProbe 以实现相应的功能开关能力。

## 架构特点

FeatureProbe 架构的设计主要考虑了高性能、可弹性伸缩、用户隐私和可扩展性方面。

### 高性能

由于 SDK 需要集成在你的应用程序运行环境中，所以我们对它采用了高度可容错和高性能的设计，即便 FeatureProbe Server 不可用，也不会影响你应用程序中已经生效的开关规则正常读取， 因为我们对 Server 端的 SDK 采用多级缓存及基于本地内存的规则逻辑计算，支持以纳秒级获取开关的判定结果。

### 可弹性伸缩

[FeatureProbe Server ](https://github.com/FeatureProbe/feature-probe-server)采用 Rust 语言实现，天然具备高性能和高可靠性。如下图所示，通过快速水平扩容能让你轻松应对大规模流量访问。同时，我们已经在计划采用长连接（Multiplexing）+发布订阅模式进一步提高 Server 的性能，做到使开关规则在变更后能在毫秒级下发和生效。

![featureprobe server](/feature-probe-server.png)

### 用户隐私

因为开关执行仅发生在客户端运行的 SDK 中，所以整体架构也保证了隐私方面。我们不会收集或共享任何用户数据，这也使得我们有信心声明我们符合 [GDPR](https://gdpr-info.eu/)。

### 可扩展性

我们开放了所有的 OpenAPI，您可以基于它进行业务扩展或定制。
