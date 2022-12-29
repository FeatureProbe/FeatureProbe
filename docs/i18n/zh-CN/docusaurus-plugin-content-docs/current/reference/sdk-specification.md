---
sidebar_position: 2
---

# SDK 实现原理

本文档主要介绍 FeatureProbe SDK 的实现原理。

:::tip
FeatureProbe SDK 分为 Client-side SDK 和 Server-side SDK 两种，相关概念可以查看[SDK 基本概念](/reference/sdk-introduction)文档。
:::



## 实现原理

### Server-side SDK

![image-20221028095725775](/server_side_sdk.png)

如上图所示，Server-Side SDK 主要用在业务系统的后端服务，核心实现主要有以下几个部分：

#### 1、初始化

初始化 FeatureProbe Client 实例。以 Java 代码为例 `FeatureProbe` 实例创建后，即表示完成初始化。

```java
FPConfig config = FPConfig.builder().remoteUri(/* FeatureProbe Server URI */)
        .build();
// 执行初始化
FeatureProbe fpClient = new FeatureProbe(/* FeatureProbe Server SDK Key */, config);
```

初始化的工作原理是 SDK 通过 HTTP 方式从服务端（FeatureProbe Server）中拉取指定 `serverSdkKey` 下的所有开关/人群组[规则](https://github.com/FeatureProbe/server-sdk-specification/blob/065c758e62b057e8f0664f9d2561fa1d35200306/spec/toggle_simple_spec.json)，然后存储在 SDK 内部。

对于强依赖开关访问结果的业务，SDK 需要保证初始化时从 Server 拉取开关规则数据尽可能成功，所以我们在初始化增加了 `StartWait`  等待机制，当初始化失败时（如网络超时），会进行初始化重试，直到初始化成功或超过 `StartWait` 时间。同时 SDK 提供了 `fpClient.initialized()` 函数来获取首次初始化结果。

#### 2、获取开关结果

SDK 针对不同开关的返回值类型提供了对应的函数来计算开关结果：

```java
boolean boolValue  = fpClient.boolValue("YOUR_TOGGLE_KEY", user, false);
String stringValue = fpClient.stringValue("YOUR_TOGGLE_KEY", user, false);
....
```

由于 SDK 内部在初始化时存储的了开关规则，所以在获取开关结果规则的计算均只在 SDK 中实现的，无须任何网络交互。当业务代码调用 SDK 时，会根据内存中缓存的开关规则，即时计算返回值。

#### 3、同步开关规则

当开关发生变更时，SDK 需要获取到最新开关规则，以保证计算结果的实现性。 所以 SDK 在内部采用轮训（**Polling**）机制（默认3秒一次）异步从 FeatureProbe server 来获取最新开关规则更新到缓存，在每次获取开关结果时都将基于最新规则计算返回结果。

#### 4、开关访问数据上报

SDK 的访问数据可以在[数据监控](/how-to/platform/metrics)功能模块中实时展示，所以 SDK 每次获取开关结果后同时会收集当前命中的分组及开关版本信息，为保证不影响 SDK 访问性能，访问数据收集会先记在本地内存中，然后定时（默认每3秒）聚合上报到 FeatureProbe Server 上。



### Client-side SDK

![image-20221028095725775](/client_side_sdk.png)

如上图所示，Client-Side SDK 主要针对移动端 APP、浏览器端 等用户的设备环境，核心实现主要有以下几个部分：

#### 1、初始化

由于 Client-side SDK 本身不含有规则运算的功能，所以在初始化时需要把所代表的用户的各种属性上传服务端，由服务端（FeatureProbe Server）计算所有开关对于当前用户的开关返回结果，然后返回给 Client-side SDK 缓存到 App 中。以下为 Android SDK 初始化示例：

```java
val user = FpUser()
user.setAttr("name", "bob") // 构建用户属性
val config = FpConfig(/* FeatureProbe Server URI */, /* FeatureProbe Server SDK Key */, 10u, true)
val fpClient = FeatureProbe(config, user) // 上报用户属性来执行初始化
```

#### 2、获取开关结果

由于初始化时已经将所有开关计算结果同步并缓存到 App 中，所以业务代码获取对应的开关值时，是通过 FeatureProbe SDK 直接获取的内存缓存结果。

#### 3、同步开关结果

Client-side SDK 同步方式 Server-side SDK 一致，均是使用轮训（**Polling**）机制异步从 FeatureProbe server 同步数据。主要区别在于 Client-side SDK 同步的是开关访问结果。

#### 4、开关访问数据上报

 开关访问数据上报实现机制和 Server-side SDK 一致。
