---
sidebar_position: 2
---

# SDK 基本概念

本文档主要介绍 FeatureProbe SDK 的分类，实现的原理，相同点和不同点。

## SDK 作用

FeatureProbe SDK 通过 User 对象存储用户的特有属性，根据在 FeatureProbe 的 UI 平台中配置的开关规则，匹配属性，返回对应设置的值。

## SDK 区别

FeatureProbe SDK 分为 Client-side SDK 和 Server-side SDK 两种

### Client-side SDK

主要针对浏览器，移动端等 APP 用户的设备环境，支持 Web（JavaScript），Android 和 iOS 三种平台。有如下特点：

* 一般Client SDK和用户有一对一的关系，Client SDK总是代表同一个用户请求开关的结果。
* 设备的性能和安全的级别不如在 IDC 中的服务器

### Server-side SDK

主要用在业务系统的后端服务中，支持 Golang，Java，Rust，Python 等语言。有以下特点：

* 业务系统后端服务通常会处理大量用户的请求，需要代表不同用户请求FeatureProbe SDK，拿到每个用户的开关结果。
* 服务器的性能较高，可以承担部分计算任务

:::tip
了解更多关于 Client-side SDK 和 Server-side SDK 区别，可以查看[SDK 实现原理](/reference/sdk-specification)文档。
:::

## SDK Key

* Client SDK Key 只能用在 Client-side SDK 中，只能拉取开关对特定用户的返回结果。
* Server SDK Key 只能用在 Server-side SDK 中，拉取计算规则，并在 SDK 中实时求值。

## 主要数据结构

各语言的SDK都实现了以下的主要数据结构。

- FPConfig
  - `remote url`: 服务端地址
  - `sdk key`: 分为 server 和 client 两种，用于拉取开关信息，在 UI 平台的项目列表中可以找到
  - `refresh interval`: 开关拉取间隔和开关访问信息上报间隔
  - `wait first response`: 是否等待拉取开关后返回，如果是否，刚启动时的开关求值会拿到默认值 

- FPUser
  - `new` 方法: 参数为用户在业务中的唯一标识，用于区分不同的用户
  - `with` 方法: 用来上传属性，会在平台的规则中根据属性返回不同的值

- FeatureProbe
  - `value` 方法: 分为 bool/string/number/json 四种，用于获取 UI 平台中规则对应的值，四种类型对应平台开关创建的四种类型
  - `detail` 方法: 分为 bool/string/number/json 四种，用于获取 UI 平台中规则对应的值，和更多的调试信息
  - `close` 方法: 优雅关闭FeatureProbe client，确保所有监控信息上传完毕。

- FPDetail
  - `value` : UI 平台中规则对应的值
  - `rule index`: 命中规则的在 UI 配置中规则的序号
  - `variation index`: 返回的值，在 UI 平台中variation列表中的序号
  - `version`: 命中开关的版本
  - `reason`: 返回值对应的原因，如 disabled, default, not exist 等



## 隐私

User 中的属性目前 FeatureProbe 不会持久化。

* Server-side SDK 的 User 对象是在开发者自己的应用中，不会发给 FeatureProbe 的服务器。
* Client-side SDK 的 User 会发给 FeatureProbe 的服务器，但是不会存储，仅用作当时的规则求值，计算完即释放。
