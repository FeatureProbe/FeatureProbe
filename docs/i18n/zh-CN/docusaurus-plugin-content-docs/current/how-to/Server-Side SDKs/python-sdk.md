---
sidebar_position: 5
---

# Python SDK

本文介绍如何在一个 Python 项目中使用 FeatureProbe SDK。

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API 文档  | [ SDK API docs](https://test-fp-server-py.readthedocs.io/en/latest/api.html) |
| GitHub 代码库 | [Server-SDK for Python](https://github.com/FeatureProbe/server-sdk-python) |
| 接入示例      | [Demo code](https://github.com/FeatureProbe/server-sdk-python/blob/main/demo.py) |
| 已发布模块    | [ PyPI](https://pypi.org/project/featureprobe-server-sdk-python/) |

:::



:::tip
对于首次使用FeatureProbe的用户，我们强烈建议你在阅读过[灰度放量教程](../../tutorials/rollout_tutorial/)之后，再回到这篇文章继续阅读。
:::

## 接入业务代码

后端项目通常只需要实例化一个FeatureProbe SDK（Client）。
然后针对不同用户的请求，调用FeatureProbe Client获取对每一个用户的开关处理结果。

:::info
服务端SDK采用异步连接FeatureProbe服务器拉取判定规则的方式，判定规则会在本地存缓。所有对用户代码暴露的接口都只涉及内存操作，调用时不必担心性能问题。
::: 

### 步骤 1. 安装 FeatureProbe SDK

首先，在您的环境中安装 FeatureProbe SDK。

#### pip

```bash
pip3 install featureprobe-server-sdk-python
```

> 您可通过 [TestPyPI](https://test.pypi.org/project/featureprobe-server-sdk-python/) 安装预发行的版本。

<!-- WIP
#### conda

Will be supported later.

```bash
conda install featureprobe-server-sdk-python
```
-->

### 步骤 2. 创建一个 FeatureProbe instance

在程序中导入 SDK，然后创建 FeatureProbe sdk 的单个共享实例。

```python
import featureprobe as fp

config = fp.Config(remote_uri=/* FeatureProbe Server URI */, sync_mode='pooling', refresh_interval=3)
client = fp.Client(/* FeatureProbe Server SDK Key */, config)

if not client.initialized():
		print("SDK failed to initialize!")
```

:::note
您可以使用`上下文管理器`（即 `with`）来创建一个 fp.Client，在离开上下文时会自动 close 该实例。
:::

### 步骤 3. 使用 FeatureProbe 开关获取设置的值

您可以使用 sdk 拿到对应开关名设置的值。

```python
user = fp.User().with_attr('ATTRIBUTE_NAME_IN_RULE', VALUE_OF_ATTRIBUTE)
bool_eval = bool(client.value('YOUR_TOGGLE_KEY', user, default=False))
if bool_eval:
    ...  # application code to show the feature
else:
    ...  # the code to run if the feature is off
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
pip3 install -r requirements-dev.txt
pytest featureprobe
```
