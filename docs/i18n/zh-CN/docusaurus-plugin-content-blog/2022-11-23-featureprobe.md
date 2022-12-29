---
slug: FeatureProbe 降级服务
title: 功能管理的实践场景 — 运维服务降级
---

运维开关(Ops Toggles)是特性管理（Feature Management）的核心应用场景之一。这类开关通常从运维的角度管控系统功能，比如当我们上线的新功能出现问题或某个依赖服务出现故障时，运维或研发人员可以禁用功能或服务降级，来减少故障对系统整体的影响。本文将介绍如何使用 FeatureProbe 实现手动降级开关和自动降级开关。

####  一、什么是降级开关 ？
服务降级作为服务容错的常用方式之一，其思想是牺牲系统中非核心功能或服务来保证系统整体可用性。常用的服务降级方式有**熔断降级**、**限流降级**以及**开关降级**，这些不同的降级方式分别应对不同的故障场景。

关于熔断降级和限流降级方式不展开介绍，这里的开关降级指的是在代码中预先埋设一些开关，并实时获取开关的状态来控制服务的行为。比如，开关开启的时候访问下游服务获取实时数据，当依赖的下游服务出现故障时，立即关闭开关来访问旧的缓存数据或默认值；再比如，在电商大促期间为了保障核心服务用到的计算资源，通过开关来关闭非核心服务。

下面是利用开关执行降级逻辑的代码示例：

```// 获取降级开关返回值
degradeRpcService := fpClient.BoolValue("degrade_rpc_service", false)
if degradeRpcService {
  // 执行降级逻辑, 如从缓存中获取旧数据} else {
  // 调用正常逻辑，如从远程服务获取实时数据
}
```
其中  degrade_rpc_service 就是一个典型的降级开关。

#### 二、如何实现手动降级开关？
实现降级开关通常会考虑使用配置中心、Redis 或数据库等来存储开关值，并用对应的 client 端获取开关结果。但这些通用工具的使用界面对开关场景的用户来说并不十分友好。FeatureProbe 作为专门的开关管理服务，不仅提供了 client 实时获取开关状态的功能，同时还能让你在统一的平台上可视化管理开关和控制开关状态，让开关控制更加高效、安全。

降级开关通常是一个 boolean 类型的开关，对应的返回（分组）值也只有两种情况，如下图所示：
![](https://oscimg.oschina.net/oscnet/up-2c04d5d8c55c1f9f95b9a879391999c1a39.jpg)

应用程序可通过接入 FeatureProbe SDK 来获取该降级开关返回值，以 Java 代码为例：
```final FeatureProbe fpClient = new FeatureProbe(FEATURE_PROBE_SERVER_SDK_KEY, config);
boolean isDegrade = fpClient.boolValue("degrade_rpc_service", new User(), false);
if (isDegrade) {
  // 降级处理逻辑
  return;
}
```
当 RPC 调用的服务出现故障时，只需要修改默认规则中的返回值为“降级”并发布，即可实现快速人工降级操作。

#### 三、如何实现自动降级开关？

为了尽可能提高降级效率，某些开关降级场景不希望需要人工干预降级。比如我们希望在 11月10号 23:59 时对某些服务执行降级以应对第二天的大促活动；当我们监控系统发现下游服务触发 P0 报警时，希望立即执行降级等等。这些自动降级场景都可以非常方便地使用 FeatureProbe 实现。

##### 1、基于规则的自动降级
FeatureProbe 提供了灵活规则配置，让你实现自动降级。例如双十一大促开始时，需要关闭退款服务，以满足大部分消费者在平台上获得稳定的交易体验。如下图所示，提前配置好降级规则后，将在 11.10 23:59:59 时自动执行对服务降级而不需要人工干预。
![](https://oscimg.oschina.net/oscnet/up-a86813b743b791c7b1cf380682b41852393.jpg)

对于上述降级规则在接入 SDK 的代码也无须特殊处理，FeatureProbe SDK 将自动根据服务器时间来决定是否降级。

##### 2、基于外部触发的自动降级
另外一种自动降级场景是由外部系统触发，如监控系统。该场景下可以使用 FeatureProbe OpenAPI 来自动变更开关状态。如下脚本所示，通过 OpenAPI 修改开关默认返回值实现自动降级操作：
```
curl 'https://featureprobe.io/api/projects/{PROJECT KEY}/environments/{ENV KEY}/toggles/{TOGGKE KEY}/targeting' \
  -X 'PATCH' \
   -H 'Authorization: {YOU API KEY}' -H 'Content-Type: application/json' --data-raw '{
    "comment":"执行降级",
    "content":{
        "defaultServe":{
            "select": 0
        },
        "variations":[
            {
                "value":"true",
                "name":"降级",
            },
            {
                "value":"false",
                "name":"不降级",
            }
        ]
    }
}'
```
更多关于 OpenAPI 使用介绍可以查看[文档](https://featureprobe.io/api-docs "文档")。

本文主要介绍了什么是降级开关，同时分别演示了手动和自动开关降级使用方式，以及如何通过 FeatureProbe 的规则配置实现自动降级以及如何由外部触发 FeatureProbe 的 OpenAPI 来实现自动降级。关于更多开关降级的使用场景欢迎来和我们一起共同探讨和分享。

目前 FeatureProbe 使用 Apache 2.0 License 协议已经完全开源。你可以从 [GitHub ](https://github.com/FeatureProbe) 或 [Gitee](https://gitee.com/featureprobe "Gitee") 上获取到所有代码。

与此同时，我们提供了无需部署的在线[试用环境](https://featureprobe.io/  "试用环境")和一个仅需5分钟即可体验的[示例项目](https://featureprobe.io/demo/  "示例项目")

如果你对功能（特性）管理感兴趣，欢迎加入到我们的开源项目中来，共同推动软件开发行业的效能。
