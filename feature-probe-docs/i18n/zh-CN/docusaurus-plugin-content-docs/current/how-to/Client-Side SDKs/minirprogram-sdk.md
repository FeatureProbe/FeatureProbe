---
sidebar_position: 4
---

# 小程序SDK

:::tip
此SDK仅适用于微信小程序，其他小程序包括：支付宝、百度、钉钉、今日头条正在准备中。
:::

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API 文档  | [ SDK API docs](https://featureprobe.github.io/client-sdk-miniprogram/) |
| GitHub 代码库 | [Client Side SDK for MiniProgram](https://github.com/FeatureProbe/client-sdk-miniprogram) |
| 接入示例      | [Demo code](https://github.com/FeatureProbe/client-sdk-miniprogram/tree/main/example) |
| 已发布模块    | [npm](https://www.npmjs.com/package/featureprobe-client-sdk-miniprogram) |

:::

## 快速尝试 Demo Code

我们提供了一个可运行的演示代码，让您了解如何使用 FeatureProbe SDK。

1. 使用 docker composer 启动 FeatureProbe 服务。 [How to](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. 下载这个 repo 并运行演示程序：

```bash
git clone https://github.com/FeatureProbe/client-sdk-miniprogram.git
cd client-sdk-miniprogram
```

3.找到Demo代码 [example](https://github.com/FeatureProbe/client-sdk-miniprogram/tree/main/example),
做一些改变并再次运行程序。

<!-- ```
// open example/index.html in browser
``` -->

## 分步指南

本指南将说明中如何在 微信小程序 应用程序中使用 FeatureProbe 功能开关。

### Step 1. 安装小程序SDK

在您的应用程序中安装 FeatureProbe SDK 作为依赖项。


```js
npm install featureprobe-client-sdk-miniprogram --save
```


### Step 2. 初始化SDK客户端
初始化 SDK 客户端，填写SDK初始化过程中的必填参数


```js
import { initialize, FPUser } from 'featureprobe-client-sdk-miniprogram';

const user = new FPUser();
user.with("userId", /* userId */);

const featureProbeClient = initialize({
  remoteUrl: "https://featureprobe.io/server",
  // remoteUrl: "https://127.0.0.1:4007", // for local docker
  clientSdkKey: /* clientSdkKey */
  user,
});

featureProbeClient.start();
```

### Step 3. 获取开关的返回值


您可以从 globalData 对象中获取变量值，SDK会自动更新 `globalData.toggles` 对象

```js
const app = getApp();   // getApp是微信小程序提供的全局方法

const value = app.globalData.toggles[/* toggleKey */].value;
const reason = app.globalData.toggles[/* toggleKey */].reason;
```

您还可以使用 SDK 对外暴露的 API 来获取开关返回值或返回值详情

```js
featureProbeClient.on("ready", function() {
  const result = featureProbeClient.boolValue(/* toggleKey */, false);
  if (result) {
    do_some_thing();
  } else {
    do_other_thing();
  }
  const reason = featureProbeClient.boolDetail(/* toggleKey */, false);
  console.log(reason);
})
```

## SDK初始化的参数

| 选项            | 是否必填       | 默认值 | 描述                                                                                                                                      |
|-------------------|----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| remoteUrl         | 若其他URL未填写则必填 | n/a     | 远端 URL 用来获取开关和上报事件 |
| togglesUrl        | no             | n/a     | 单独设置开关下发 URL，如果设置会忽略 remoteUrl前缀的地址 |
| eventsUrl         | no             | n/a     | 单独设置事件上报 URL，如果设置会忽略 remoteUrl前缀的地址 |
| clientSdkKey      | yes            | n/a     | SDK Key用来验证权限   |
| user              | yes            | n/a     | User 对象可以通过With方法设置属性，用来根据属性判断开关规则 |
| refreshInterval   | no            | 1000    | 设置 SDK 的开关和事件刷新时间   |
| timeoutInterval   | no            | 1000    | 设置 SDK 初始化等待的超时时间，超时后SDK将发布`error`事件   |

## SDK的API文档

查看API文档：[SDK API](https://featureprobe.github.io/client-sdk-miniprogram/)


## SDK发布的事件

- **ready** - SDK成功从`Server端`获取开关后发布`ready`事件 
- **cache_ready** - SDK成功从本地缓存`LocalStorage`中获取缓存开关后发布`cache_ready`事件，`cache_ready`发布时不会关心SDK是否成功`ready`
- **error** - SDK无法从`Server端`成功获取开关，且超过超时时间，将发布`error`事件
- **update** - 除了首次从`Server端`获取开关外，SDK后续通过定期轮询的方式从`Server端`成功获取开关后发布`update`事件


## 集成测试

我们对所有 SDK 提供了统一的集成测试。通过以下命令运行测试。

```shell
npm run test
```