---
sidebar_position: 4
---

# Node.js SDK

本文介绍如何在一个 Node.js 项目中使用 FeatureProbe SDK。

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API 文档  | [ SDK API docs](https://featureprobe.github.io/server-sdk-node/) |
| GitHub 代码库 | [Server-SDK for Node.js](https://github.com/FeatureProbe/server-sdk-node) |
| 接入示例      | [Demo code](https://github.com/FeatureProbe/server-sdk-node/blob/main/example/demo.js) (TypeScript) |
| 已发布模块    | [ npm](https://www.npmjs.com/package/featureprobe-server-sdk-node) |

:::



:::tip
对于首次使用 FeatureProbe 的用户，我们强烈建议你在阅读过[灰度放量教程](../../tutorials/rollout_tutorial/)之后，再回到这篇文章继续阅读。
:::

## 接入业务代码

后端项目通常只需要实例化一个 FeatureProbe SDK（Client）。
然后针对不同用户的请求，调用FeatureProbe Client获取对每一个用户的开关处理结果。

:::info
服务端SDK采用异步连接FeatureProbe服务器拉取判定规则的方式，判定规则会在本地存缓。所有对用户代码暴露的接口都只涉及内存操作，调用时不必担心性能问题。
:::

### 步骤 1. 安装 FeatureProbe SDK

首先，在您的应用程序中安装 FeatureProbe SDK 作为依赖项。

#### NPM

```
npm install featureprobe-server-sdk-node --save
```

### 步骤 2. 创建一个 FeatureProbe instance

安装并导入 SDK 后，创建 FeatureProbe sdk 的单个共享实例。

```javascript
const fp = new FeatureProbe({
    remoteUrl: 'https://featureprobe.io/server',  // or https://127.0.0.1:4007
    serverSdkKey: /* FEATURE_PROBE_SERVER_SDK_KEY mentioned above */,
    refreshInterval: 5000,
});

await fp.start(1000);  // wait for up to 1 second for the first refresh
// await fp.start();  // init with time limit
```

### 步骤 3. 使用 FeatureProbe 开关获取设置的值

您可以使用 sdk 拿到对应开关名设置的值。

```javascript
const user = new User(/* uniqueUserId for percentage rollout */);
user.with('ATTRIBUTE_NAME_IN_RULE', VALUE_OF_ATTRIBUTE);  // call with() for each attribute, or extendAttrs(attributeMap) for attributes

const boolValue = fp.booleanValue('YOUR_TOGGLE_KEY', user, false);
if (boolValue) {
   // the code to run if the toggle is on
} else {
   // the code to run if the toggle is off
}
```

### 步骤 4. 程序退出前关闭 FeatureProbe Client

退出前关闭client，保证数据上报准确。

```java
await fp.close();
```

## 定制化开发本SDK

:::tip
本段落适用于想自己定制化开发本SDK，或者通过开源社区对本SDK贡献代码的用户。一般用户可以跳过此段内容。
:::

我们提供了一个本SDK的验收测试，用于保证修改后的SDK跟FeatureProbe的原生规则兼容。
集成测试用例作为每个 SDK 存储库的子模块添加。所以在运行测试之前，请务必先拉取子模块以获取最新的集成测试。

```shell
git submodule update --init --recursive
git pull --recurse-submodules
npm run test
```
