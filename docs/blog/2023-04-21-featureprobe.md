---
slug: FeatureProbe rollout percentage
title: 如何按百分比将功能灰度放量
---


当我们发布新功能时，需要尽可能降低因新功能发布所导致的线上风险，通常会采取灰度放量的方式将新功能逐步发布给用户。在具体实施灰度放量时，我们可以根据业务需求选择相应的放量规则，常见如按白名单放量（如仅 QA 可见）、按特定人群属性放量（如仅某个城市的用户可见）亦或是按用户百分比放量。  

当我们选择将功能以用户百分比放量时，如下图所示，会先将功发布给10% 内部用户，此时即便出现问题影响也相对可控，如观察没有问题后逐步扩大需要放量的用户百分比，实现从少量到全量平滑过渡的上线。

![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_LChx6glCtd8a3xF643az)

## 那么在 FeatureProbe 上要如何实现百分比放量？

下面将通过一个实际的例子介绍如何通过 FeatureProbe 实现按百分比放量发布一个新功能。

## 步骤一：创建一个特性开关

![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_mlYUpBC6rIz2W23I5YLb)

接着，配置开关百分比信息。以收藏功能百分比发布为例，设置 **10%**  的用户可用收藏功能，而另外 **90%** 的用户无法使用收藏功能。

![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_12weTSsUB7lSY2Xl1pVA)

## 步骤二：将 SDK 接入应用程序

接下来，将 FeatureProbe SDK 接入应用程序。FeatureProbe 提供完整清晰的接入引导，只需按照步骤即可快速完成 SDK 接入。

#### 1、选择所使用的 SDK  


![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_PZBwe7nstJZ6n1emnsvA)

#### 2、按步骤设置应用程序  


![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_yN6itAwx6g7CViGeQWUt)

3、测试应用程序 SDK接入情况

![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_3XVEF37xWgu4SlDwshgi)

## 步骤三：按百分比放量发布开关

开关信息配置和 SDK 接入都完成后，点击发布按钮并确认发布。这将会将收藏功能发布给用户，但只有10%的用户可以使用收藏功能。

![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_gXXek8KCPjtkCuZsY7Ld)

如果希望逐步扩大灰度范围，可以在开关规则中配置百分比比例。

![](https://gift-pypu-cdn.didistatic.com/static/featureprobe/do1_giz5Hub86igqgQAiPuaY)

大部分情况下，我们希望在一个功能的灰度放量过程中，某个特定用户一旦进入了灰度放量组，在灰度比例不减少的情况下，总是进入灰度组。不希望用户因为刷新页面、重新打开APP、请求被分配到另一个服务端实例等原因，一会看到新功能，一会看不到新功能，从而感到迷惑。要达到用户稳定进入灰度组，只需要在上述代码第三步创建 User 时指定stableRollout 即可，具体使用详情见：https://docs.featureprobe.io/zh-CN/tutorials/rollout_tutorial/stable_rollout_tutorial


## 总结

灰度按百分比放量是一种软件开发中常用的功能发布方法，它可以帮助提高软件可靠性，提高用户体验，在实施时也需要注意几个方面：

**1、确定放量目标**：首先需要确定放量的目标，例如增加多少百分比的数据量。这个目标需要根据实际情况进行制定，例如需要考虑数据量的大小、计算资源的限制等因素。

**2、确定放量规则**：你需要确定在放量过程中，哪些功能会被启用，哪些功能会被禁用。你可以根据开发进度、测试结果和市场需求等因素来确定放量规则。

**3、监控放量过程**：在实施放量操作时，需要监控放量过程，以确保放量结果的稳定性和可靠性。如果出现异常情况，需要及时采取措施进行调整。

若要了解有关FeatureProbe 灰度发布的更多信息，请查看其官方文档中的教程。该教程可以提供关于如何进行灰度发布的详细说明。文档中还包括其他相关主题的信息，例如如何进行服务降级和指标分析等。请访问以下链接以查看该文档：*https://docs.featureprobe.io/zh-CN/tutorials/rollout_tutorial/*
