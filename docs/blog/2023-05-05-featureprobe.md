---
slug: FeatureProbe JS SDK
title: 实践分享：打造极具高扩展性的JavaScript SDK
---

SDK（Software Developer Kit） 是使用 FeatureProbe 服务必不可少的工具之一。SDK能将用户的应用程序连接到 FeatureProbe 服务，根据用户的配置获取开关的结果，还能将开关的访问情况上报给 FeatureProbe，进而实现 A/B 实验的能力。

FeatureProbe 目前对外提供十余种主流开发语言的 SDK，包括用于服务端开发的 Java、Golang、Python、Rust等，以及用于客户端开发的 JavaScript、Android、iOS等。在之前的文章【[用 Rust 开发跨平台 SDK 探索和实践](http://mp.weixin.qq.com/s?__biz=MzAwNTM1MDU2OQ==&mid=2451827558&idx=1&sn=1ecadca93d1e9cde2271a87b4268ab71&chksm=8ccabea0bbbd37b6fefbf86360119c12db94bb78f305db2bb72127e297db577e1414a35425e9&scene=21#wechat_redirect)】中我们曾介绍过我们选择使用Rust开发了跨平台语言的 Android SDK 和 iOS SDK，这样做的主要原因是：

**（1）能减少人力成本和开发时间。**

**（2）共享一套代码，便于后期维护。**

在开发 JavaScript SDK 的过程中，我们也同样采用类似的思路。JavaScript是目前构建Web应用的主要语言，在此基础上产生了很多现代化的 JavaScript 前端框架，比如：React、Vue、Angular等。近几年在国内爆火的微信小程序框架也主要使用 JavaScript 语言进行开发的。如何制作一款能支持所有前端框架使用的通用 SDK，同时在此 SDK 的基础上，能够快速地根据框架的语法特性进行上层封装，是 JavaScript SDK 的核心要求之一。

## 实现思路

实现一个功能完善的 JavaScript SDK，能够在普通的 Web 前端工程中使用。在此基础上，根据框架语法特性，进一步封装其它语言的 SDK，不同语言的SDK分别管理和发版。


![image.png](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_T4Ixnb6bIZtPWYPzNuA4)

## React SDK的实现

React SDK 在实现时将 JavaScript SDK 作为依赖项安装到工程内，主要使用了 React 的 Context API 和 Context hooks 进行上层封装，方便开发者在React工程中的使用。

**1、使用 React 的 createContext API 创建一个上下文对象，保存开关 FeatureProbe 实例和开关结果的集合。2、使用 React 的 Context Hooks 封装若干个自定义 Hook，用于在任何组件内快速使用 FeatureProbe 实例和访问开关结果。**

这里我们展示了一种以高阶组件的方式使用 React SDK。

### 1、将 SDK 初始化 

​使用 FPProvider 对根组件 <App /> 进行初始化，初始化时传入必填参数 remoteUrl、clientSdkKey 和 user 对象等。

![image.png](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_2eJ5YdVji62rFGfNRtUY)

### 2、SDK 的使用


使用 withFPConsumer 高阶组件的方式包装业务组件 <Home />，组件内部可通过  props 属性访问 FeatureProbe 实例（client）和开关集合（toggles）。

**（1）client 实例上可访问 JavaScript SDK 所有对外暴露的 API，比如 booleanValue、jsonDetail、track 等。**

**（2）toggles 开关集合是同一个用户在一个 clientSdkKey 环境中调用所有开关的返回结果集合，提供了另一种获取开关结果和详情的方式。**


![image.png](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_WIldHD3gGyJMAzAuZHpX )

## 微信小程序 SDK的实现

相比较 React SDK，在 JavaScript SDK 上的集成微信小程序 SDK 更复杂一些，需要针对微信小程序的语法特性做一些兼容工作。主要的原因是微信小程序和普通的 Web 应用的运行环境不同，前者是在微信客户端运行，后者在浏览器环境中运行的。例如在浏览器环境中支持的 window 和 document 对象，在微信小程序中是不支持的。

下面的表格列举出了两种 SDK 的主要不同点：

|  | JavaScript SDK |微信小程序SDK |
| --- | --- |--- |
| 发送HTTP请求API |fetch  |wx.request|
| 本地缓存API | localStorage.setItem、localStorage.getItem |wx.setStorageSync、wx.getStorageSync|
|长连接工具库  | socket.io-client |wepapp.socket.io|
| 是否支持自动上报事件 |  支持|不支持|
|UA  | JS/1.0.1 |MINIPROGRAM/1.0.1|

在代码层面，JavaScript SDK 将上述差异进行抽离，并保存在 platform 对象中，platform对象目前包含的字段有：

**UA:** 标识SDK名称和版本；

**localStorage：** 本地存储对象，调用 localStorage.setItem() 方法保存数据，调用localStorage.getItem() 方法获取数据；

**httpRequest：** 发送请求对象，调用 httpRequest.get() 方法发送GET请求，调用httpRequest.post() 方法发送 POST 请求；

**socket：** 用于初始化socket.io-client客户端，监听开关的变更。

JavaScript SDK 导出 initializePlatform 方法，其它语言的 SDK 在初始化时可传入 platform 对象来保存配置差异部分，不传入时将使用默认值。
```
export function initializePlatform(options) {
  if (options.platform) {
    setPlatform(options.platform);
  }
}
```
以下为微信小程序 SDK 的 platform 对象构成。在发送 HTTP 请求上我们目前选择了一款开源的工具库 wefetch，方便后续支持其它的小程序 SDK，WebSocket 客户端选择了基于 socket.io 实现的 weapp.socket.io。

```
import wefetch from "wefetch";          // 小程序请求扩展
import pkg from '../package.json';      
const PKG_VERSION = pkg.version;        // 微信小程序 UA 信息
const io = require("weapp.socket.io");  // 基于 socket.io 实现的构建微信小程序的 WebSocket 客户端

// 基于微信小程序 API 封装的 localStorage 对象
class StorageProvider {
  public async getItem(key) {
    try {
      return wx.getStorageSync(key);
    } catch (e) {
      console.log(e);
    }
  }

  public async setItem(key, data) {
    try {
      wx.setStorageSync(key, data);
    } catch (e) {
      console.log(e);
    }
  }
}

// 基于微信小程序 API 封装的 httpRequest对象
const httpRequest = {
  get: function(url, headers, data, successCb, errorCb) {
    wefetch.get(url, {
      header: headers,
      data,
    }).then(json => {
      successCb(json.data);
    }).catch(e => {
      errorCb(e);
    });
  },
  post: function(url, headers, data, successCb, errorCb) {
    wefetch.post(url, {
      header: headers,
      data,
    }).then(() => {
      successCb();
    }).catch(e => {
      errorCb(e);
    });
  }
};

const platform = {
  localStorage: new StorageProvider(),
  UA: "MINIPROGRAM/" + PKG_VERSION,
  httpRequest: httpRequest,
  socket: io,
};

// 初始化
initializePlatform({ platform });
```
## 总结

上面我们介绍了在 JavaScript SDK 的基础上去开发其它语言的 SDK。核心思路是首先实现一个「大而全」的通用SDK，然后将各个语言差异的部分进行抽离，其它语言SDK在初始化时进行差异部分的替换。其它语言的SDK再根据对应的语法特性进行上层封装，底层复用 JavaScript SDK 提供的通用能力。

目前除了 JavaScript SDK 、React SDK 和 微信小程序 SDK之外，我们正在准备 Vue SDK。如果 FeatureProbe 目前提供的SDK不满足您的需求，可以通过新建issue的方式告知我们。我们也欢迎社区伙伴能为我们贡献更多语言的 SDK，贡献SDK时可参考文档 SDK 贡献指南：https://docs.featureprobe.io/zh-CN/reference/sdk-contributor/。

