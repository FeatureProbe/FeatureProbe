---
sidebar_position: 1
---

# JavaScript SDK

本文介绍如何在一个前端项目中使用 FeatureProbe SDK。

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API 文档  | [ SDK API docs](https://featureprobe.github.io/client-sdk-js/) |
| GitHub 代码库 | [Client Side SDK for JavaScript](https://github.com/FeatureProbe/client-sdk-js) |
| 接入示例      | [Demo code](https://github.com/FeatureProbe/client-sdk-js/blob/main/example/index.html) (HTML+JS) |
| 已发布模块    | [npm](https://www.npmjs.com/package/featureprobe-client-sdk-js) |

:::

## 快速尝试 Demo Code

我们提供了一个可运行的演示代码，让您了解如何使用 FeatureProbe SDK

1. 首先需要选择通过连接哪个环境的FeatureProbe来控制你的程序
    * 可以使用我们提供的在线的[演示环境](https://featureprobe.io/login)
    * 也可以使用自己搭建的[docker环境](https://gitee.com/featureprobe/FeatureProbe#%E5%90%AF%E5%8A%A8featureprobe)

2. 下载此 repo 中的演示代码：

```bash
git clone https://gitee.com/FeatureProbe/client-sdk-js.git
cd client-sdk-js
```

3. 修改`example/index.html`程序中的链接信息。
    * 对于在线演示环境:
        * `remoteUrl` = "https://featureprobe.io/server"
        * `clientSdkKey`  请从如下界面中拷贝：

      ![client_sdk_key snapshot](/client_sdk_key_snapshot_cn.png)
    * 对于本地docker环境:
        * `remoteUrl` = "http://YOUR_DOCKER_IP:4009/server"
        * `clientSdkKey` = "client-25614c7e03e9cb49c0e96357b797b1e47e7f2dff"

4. 运行程序。

```
// open example/index.html in browser
```

## 分步指南

本指南将说明中如何在 JavaScript 应用程序中使用 FeatureProbe 功能开关。

### 步骤 1. 安装 JavaScript SDK

首先，在您的应用程序中安装 FeatureProbe SDK 作为依赖项。

NPM：

```shell
npm install featureprobe-client-sdk-js --save
```

或者通过CDN：

```js
<script type="text/javascript" src="https://unpkg.com/featureprobe-client-sdk-js@latest/dist/featureprobe-client-sdk-js.min.js"></script>
```

### 步骤 2. 创建一个 FeatureProbe instance

安装并导入 SDK 后，创建 FeatureProbe sdk 的单个共享实例。

NPM：

```js
const user = new FPUser();
user.with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);

const fp = new FeatureProbe({
  remoteUrl: /* FeatureProbe Server URI */,
  clientSdkKey: /* FeatureProbe Server SDK Key */,
  user,
});

fp.start();
```

或者通过CDN：

```js
const user = new featureProbe.FPUser();
user.with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);

const fp = new featureProbe.FeatureProbe({
    remoteUrl: /* FeatureProbe Server URI */,
    clientSdkKey: /* FeatureProbe Server SDK Key */,
    user,
});

fp.start();
```

### 步骤 3. 使用 FeatureProbe 开关获取设置的值

您可以使用 sdk 拿到对应开关名设置的值。

```js
fp.on('ready', function() {
    const result = fp.boolValue('YOUR_TOGGLE_KEY', false);
    if (result) {
        do_some_thing();
    } else {
        do_other_thing();
    }
    const reason = fp.boolDetail('YOUR_TOGGLE_KEY', false);
    console.log(reason);
})
```

### 步骤 4. 单元测试 (可选)

NPM：

```js
test("feature probe unit testing", (done) => {
  let fp = FeatureProbe.newForTest({ testToggle: true });
  fp.start();

  fp.on("ready", function () {
    let t = fp.boolValue('YOUR_TOGGLE_KEY', false);
    expect(t).toBe(true);
    done();
  });
});
```

或者通过CDN：

```js
test("feature probe unit testing", (done) => {
  let fp = featureProbe.FeatureProbe.newForTest({ testToggle: true });
  fp.start();

  fp.on("ready", function () {
    let t = fp.boolValue('YOUR_TOGGLE_KEY', false);
    expect(t).toBe(true);
    done();
  });
});
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
| timeoutInterval   | no            | 1000    | 设置 SDK 初始化等待超时时间，超时后SDK将发布`error`事件   |


## SDK的API文档

查看API文档：[SDK API](https://featureprobe.github.io/client-sdk-js/)


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
