---
sidebar_position: 5
---

# React SDK

:::tip
React SDK是在 JavaScript SDK的基础上进行的封装，主要为了提升在React项目中的使用体验。JavaScript SDK中的大部分方法在React SDK中也同样适用，详见[JavaScript SDK](./javascript-sdk.md)。
:::

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API 文档  | [ SDK API docs](https://featureprobe.github.io/client-sdk-react/) |
| GitHub 代码库 | [Client Side SDK for React](https://github.com/FeatureProbe/client-sdk-react) |
| 接入示例      | [Demo code](https://github.com/FeatureProbe/client-sdk-react/tree/main/example) |
| 已发布模块    | [npm](https://www.npmjs.com/package/featureprobe-client-sdk-react) |

:::

## 快速尝试 Demo Code

我们提供了一个可运行的演示代码，让您了解如何使用 `FeatureProbe` SDK。

1. 使用 docker composer 启动 FeatureProbe 服务。 [How to](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. 下载这个 repo 并运行演示程序：


```bash
git clone https://github.com/FeatureProbe/client-sdk-react.git
cd client-sdk-react
```

3.找到Demo代码 [example](https://github.com/FeatureProbe/client-sdk-react/tree/main/example),
做一些改变并再次运行程序。

第一个demo：
```bash
cd example/provider
npm install
npm run start
```

第二个demo：

```bash
cd example/async-provider
npm install
npm run start
```

## 分步指南

本指南将说明中如何在 `React` 应用程序中使用 `FeatureProbe` 功能开关。

### Step 1. 使用create-react-app新建一个React项目

```js
npx create-react-app react-demo && cd react-demo
```

### Step 2. 安装SDK

```js
npm install featureprobe-client-sdk-react --save
```

### Step 3. 在App.js中引入FPProvider


```jsx
import { FPProvider } from 'featureprobe-client-sdk-react';
import Home from './home';

function App() {
  const user = new FPUser();
  user.with("userId", /* userId */);
  
  return (
    <FPProvider 
      config={{
        remoteUrl: "https://featureprobe.io/server",
        // remoteUrl: "https://127.0.0.1:4007", // for local docker
        clientSdkKey: /* clientSdkKey */
        user,
      }}
    >
      <Home />
    </FPProvider>
  );
}

export default App;
```

### Step 4. 在App.js同级目录下创建home.js，并在home.js中引入withFPConsumer

```jsx
import { withFPConsumer } from 'featureprobe-client-sdk-client';

const Home = ({ toggles, client }) => {
  const value = client?.boolValue(/* toggleKey */, false);
  return (
    <div>
      <div>You can use toggle value like this: ${value}</div>
      <div>You can also get toggle detail from toggles object like this: ${toggles?.[/* toggleKey */]}</div>
    </div>
  )
};

export default withFPConsumer(Home);
```

## API

### FPProvider
使用`FPProvider`进行SDK初始化。`FPProvider`方法接收`config`对象作为参数，`config`对象中需配置SDK初始化时必填的[参数](./javascript-sdk#available-options)

```jsx
import { FPProvider } from 'featureprobe-client-sdk-react';
import Home from './home';

function App() {
  const user = new FPUser();
  user.with("userId", /* userId */);
  
  return (
    <FPProvider 
      config={{
        remoteUrl: "https://featureprobe.io/server",
        // remoteUrl: "https://127.0.0.1:4007", // for local docker
        clientSdkKey: /* clientSdkKey */
        user,
      }}
    >
      <Home />
    </FPProvider>
  );
}

export default App;
```

你也可以将已经初始化好的SDK实例作为参数传递给FPProvider：

```jsx
import { FPProvider, FeatureProbe } from 'featureprobe-client-sdk-react';
import Home from './home';

function App() {
  const user = new FPUser();
  user.with("userId", /* userId */);

  const client = new FeatureProbe({
    remoteUrl: "https://featureprobe.io/server",
    // remoteUrl: "https://127.0.0.1:4007", // for local docker
    clientSdkKey: /* clientSdkKey */
    user,
  })
  
  return (
    <FPProvider 
      FPClient={client}
    >
      <Home />
    </FPProvider>
  );
}

export default App;
```

### AsyncFPProvider

`AsyncFPProvider`是另一种SDK初始化方法，初始化过程中会等待开关结果从服务端返回，保证渲染组件之前能够拿到开关结果。

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { AsyncFPProvider, FPUser } from 'featureprobe-client-sdk-react';

(async () => {
  const FPProvider = await AsyncFPProvider({
    remoteUrl: "https://featureprobe.io/server",
    // remoteUrl: "https://127.0.0.1:4007", // for local docker
    clientSdkKey: /* clientSdkKey */
    user,
  });

  const root = ReactDOM.createRoot(document.getElementById('root'));

  root.render(
    <FPProvider>
      <App />
    </FPProvider>
  );
})();
```

### withFPConsumer
SDK初始化成功后，使用`withFPConsumer`方法来获取开关结果，以及`FeatureProbe`SDK实例。


```jsx
import { withFPConsumer } from 'featureprobe-client-sdk-react';

function HocComponent(props) {
  const { toggles, client } = props;
  const value = client.boolValue(/* toggleKey */);

  return (
    <div>
      <div>{JSON.stringify(toggles)}</div>
      <div>{value}</div>
    </div>
  );
}

export default withFPConsumer(HocComponent);
```

React SDK提供了2个自定义hooks来替代`withFPConsumer`方法：`useFPClient`和`useFPToggles`。

### useFPClient
自定义hooks`useFPClient`用于返回`FeatureProbe`实例。

```jsx
import { useFPClient } from 'featureprobe-client-sdk-react';

function HookComponent() {
  const client = useFPClient();
  return (
    <div style={{marginTop: '20px'}}>
      <div>Hook</div>
      <samp>{`console.log(JSON.stringify(client.boolDetail('demo_features')))`}</samp>
      <div>{JSON.stringify(client.boolDetail('demo_features'))}</div>
    </div>
  );
}

export default HookComponent;
```

### useFPToggles
自定义hooks`useFPToggles`用于返回所有开关结果

```jsx
import { useFPToggles } from 'featureprobe-client-sdk-react';

function HookComponent() {
  const toggles = useFPToggles();
  return (
    <div>
      <div>{JSON.stringify(toggles)}</div>
    </div>
  );
}

export default HookComponent;
```

## SDK的API文档

查看API文档：[SDK API](https://featureprobe.github.io/client-sdk-react/)


## 集成测试

我们对所有 SDK 提供了统一的集成测试。通过以下命令运行测试。

```shell
npm run test
```