---
slug: FeatureProbe
title: FeatureProbe：如何快速、安全地进行功能发布
---
在产品快速迭代中，要做到高效的功能发布同时还要降低上线风险，需要采用合适的技术对功能发布进行精细化的管控。FeatureProbe 就是一个高效的功能管理（Feature management）开源服务，它提供了灰度放量、AB实验、实时配置变更等针对功能粒度的一系列管理能力，本文将介绍如何使用 FeatureProbe 进行快速、安全地做功能发布和迭代。
### 一、动态配置
如果你没有接触过功能管理服务，那相信你对配置中心不会陌生。从分布式系统兴起之后，配置中心已经是分布式系统中不可或缺的一部分。从技术上来说，功能管理或配置中心本质上都是通过配置规则动态控制应用程序行为，所带来的好处是省去了修改代码、编译、打包、部署流程。在动态配置的实践中，我们通常会以 **Key-Value** 的形式将配置规则存储在某个服务中统一管理，并通过数据分发将配置传输至应用程序中，同时还有一个可以给应用程序获取配置的客户端库(SDK)。
下面通过一个示例演示 **Key-Value** 配置以及如何通过代码获取配置：
```
// key-value config:
{ "enable_feature_124": true }

// sdk code: 
sdkClient.BooleanValue("enable_feature_124") => true
```
对于一些简单配置需求都可以用这种 **Key-Value** 方式组织和获取配置，例如： 
+ **“控制功能 #124 关闭或开启”**    
+ **“将 'name' 文本框的字符大小限制为 256 个字符”**
+ **“redis 的连接地址是 '172.48.1.4:6379' ”**

与上述类似的使用方式已经在功能开关、应用程序配置、快速限流降级等领域被广泛应用。
上述基于一对一的 Key-Value 映射配置虽然已经足够灵活通用，但仍然难以支持一些较复杂的功能场景。比如我们很难在 **Key-Value** 配置中体现如下场景：  
+ **场景1：“只有从北京访问的且'级别'是 VIP 的用户启用功能 #124”**              
+ **场景2：“只有用户 APP 版本大于 1.0.1 且在每天 18:00~20:00 时开启运营活动，否则关闭活动并显示‘活动已结束’的提示信息”**                             

上述场景的特点是应用程序在运行时需要根据上下文信息计算出相应的值，并且当上下文（需求）发生变化时，例如调整场景一为 **“只有北京10%的用户启用功能  #124 ”** ，在不更改代码的情况下很难做到快速支持。这也是 FeatureProbe 作为功能管理服务与传统 **Key-Value** 配置中心最大的区别：

||配置定义|SDK|特点|
--|--|--|--|
|配置中心|Key-Value|根据 key 获取 value|<ul> <li>难以在配置中体现业务逻辑 </li> <br/> <li>难以通过变更配置来快速调业务逻辑 </li> </ul>|
|功能管理服务|由一组表达业务语义的 if / else 逻辑组成|根据 key + user 属性（上下文）来执行配置中定义的逻辑并判定出返回的 value|<ul> <li>配置中体现业务逻辑</li> <br/> <li> 变更配置规则快速调整业务逻辑 </li> </ul>|

下面通过一个简单示例演示功能管理服务的配置定义以及如何用代码获取相应的值：

```
// feature management config:
"enable_feature_124" : {
  if user ("city" equals "beijing" and "level" equals "vip") : true,
  else                                                       : false
}

// sdk code:
sdkClient.BoolValue("enable_feature_124", {city: "beijing", level: "vip"}) => true
sdkClient.BoolValue("enable_feature_124", {city: "shanghai", level: "vip"}) => false
```
### 二、渐进式发布

接下来我们通过一个示例来介绍如何使用 FeatureProbe，比如当我们需要发布一个新功能时，为了避免新功能的代码对线上产生影响，我们会使用功能开关 **（Feature toggles）** 来控制新功能的代码只能被某个城市的某些用户访问到。代码如下所示：

```
user := featureprobe.NewUser(reuqest.userid)
                    .With("city", request.city)
                    .With("username": request.username)

enableFeature123 := fpClient.BoolValue("enable_feature_123", user, false)
if enableFeature123 {
  // new code: use the feature
} else {
  // old code: don't use the feature
}
```
当我们将新功能代码部署后，对应用程序几乎不会产生任何影响，因为在默认情况下，所有新功能的代码都被功能开关控制，同时是否启用新功能的开关初始默认值为 false。下面为该功能开关配置规则：
**FeatuteProbe toggle rules**
```
"enable_feature_123": {
      "defaultServe": {
        "select": 1   // Return "variations[1]" by default => false
      },
      "variations": [
        true,
        false
      ]
}
```
当我们要对新功能代码线上验证时，这时候希望 **“城市为 北京，且用户名为 'test' 或 'admin' 的特定测试用户才能使用该功能”**,以便于这些用户进行功能验证。此时我们会对功能开关配置进行修改，最终生成的规则配置如下所示（对应规则执行逻辑为右边注释）：
```
{
    "enable_feature_123":{ 
        "rules":[
            {
                "conditions":[ // if city in ["beijing"] 
                    {
                        "type":"string",
                        "subject":"city",
                        "predicate":"is one of",
                        "objects":[
                            "beijing"
                        ]
                    }, // AND
                    {
                        "type":"string", // username in ["test", "admin"]
                        "subject":"username",
                        "predicate":"is one of",
                        "objects":[
                            "test", "admin"
                        ]
                    }
                ]
                "serve":{
                    "select":0 // return "variations[0]"  => true
                },
            }
        ]
         "defaultServe":{ // else
            "select":1 // return "variations[1]"  => false
        }, 
    },
    "variations": [
        true,
        false
      ]
}
```
该配置更新后，会通过我们的数据分发服务 **（FeatureProbe Server）** 将配置下发到所有需要使用的应用程序中。当应用程序每次通过 SDK 获取返回值时，它将根据 **key + user** 属性以及最新配置规则所定义的逻辑来计算相应的结果。

当测试用户 **"test" 在 “北京”** 测试该新功能发现问题时，可以通过将开关返回值更新回 **false** 快速关闭新功能的使用。整个过程不涉及到任何代码的变更，即便将需求调整为 **“只有北京10%的用户能访问该功能”**，也仅需在页面就能完成逻辑的变更操作，然后将新的配置规则发布应用程序中即可，通常整个过程只需要几秒钟。

当功能开关被开启后，可以通过数据监控或集成测试来观察新功能对应用程序造成影响。当验证符合预期的情况后，可就再进一步修改规则配置来让更多的用户使用该功能，如先让某个城市所有人使用该功能，接着继续将用户扩展到多个城市，并最终扩展所有用户。在整个放量过程中，检测到任何问题，都可以立即更新规则或关闭开关来做到快速回滚。通过这种渐进式功能发布 **（Progressive Delivery）** 的方式，能够帮助我们实现快速、安全地进行线上变更。

当然，渐进式功能发布只是 FeatureProbe 的使用场景之一，其它基于规则的配置的场景也都能很好地支持，如按访问流量放量、基于时间规则的运营活动控制、A/B实验及配置中心等场景。

### 三、快速试用

目前 FeatureProbe 使用 Apache 2.0 License 协议已经完全开源。你可以从 [GitHub](https://github.com/FeatureProbe) 或 [Gitee](https://gitee.com/featureprobe) 上搜索 FeatureProbe 获取到所有代码，为了能够让大家快速体验完整的功能服务，我们提供了[在线体验环境](https://featureprobe.io/demo)。

### 四、总结

本文主要介绍了如何使用 FeatureProbe 快速更新迭代产品功能，并且通过一个实际案例介绍如何使用它进行渐进式的功能发布，以降低线上变更的风险。在下一篇文章中，我们将介绍 **“FeatureProbe的架构设计和主要特点”**。

如果你对功能开关管理感兴趣，欢迎加入到我们的开源项目中来，共同来推动软件开发行业的效能。同时也可以扫描以下二维码加入我们的开源沟通群大家一起来沟通探讨。

<img src="https://user-images.githubusercontent.com/20610466/184835902-4a466b69-6f53-4898-850e-ea6e5548d015.png" width = "200" height = "300" />


如以上二维码失效，可扫描以下二维码，添加我们的工作人员。

<img src="https://user-images.githubusercontent.com/20610466/184836044-fc5396aa-8ac9-4a95-b8eb-70050caa686f.png" width = "220" height = "200" />

