---
sidebar_position: 1
---

# feature-probe-ui

## 环境要求

[Node.js](https://nodejs.org/en/download/) 16.13及以上的版本（可通过执行`node -v`来查看当前的Node.js的版本）。您可以使用[nvm](https://github.com/nvm-sh/nvm)来管理多个Node版本。

## 安装

克隆代码

```shell
git clone git@github.com:FeatureProbe/FeatureProbe.git
cd FeatureProbe/feature-probe-ui
```

使用`yarn`安装依赖

```shell
yarn install
```

:::info
我们推荐您使用`yarn`作为包管理工具，如果您使用`npm install`安装依赖并遇到如下报错，请使用

~~~shell
npm install --legacy-peer-deps
~~~

![toggles screenshot](/local_develop_install_error.png)
:::

## 启动本地服务

```shell
yarn start
```

该命令启动一个本地开发服务器并打开一个浏览器窗口，默认端口为3000。访问 `http://localhost:3000` 来查看UI项目。


## 代理API请求

通过在`package.json`文件中添加一个`proxy`字段，你可以在开发环境将所有的请求代理到目标API服务。

```
"proxy": "https://featureprobe.io/"
```

源码里内置的`proxy`字段是我们的开源demo服务：`https://featureprobe.io/`，如果你私有化部署了自己的API服务，将`proxy`字段的值替换成自己的服务地址即可。


## 私有化部署

如果你想单独私有化部署UI项目，参考这篇文档: [UI Service](../deploy/deployment-source-code#编译部署-UI-服务)