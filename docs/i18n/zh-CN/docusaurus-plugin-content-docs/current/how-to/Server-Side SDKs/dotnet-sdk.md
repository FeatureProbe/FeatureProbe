---
sidebar_position: 1
---

# .NET SDK

本文介绍如何在一个 .NET 项目中使用 FeatureProbe SDK。

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示： |

| **Resource**  | **Location**                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| SDK API 文档  | [ SDK API docs](https://featureprobe.github.io/server-sdk-dotnet/)                                                                   |
| GitHub 代码库 | [Server-SDK for .NET](https://github.com/FeatureProbe/server-sdk-dotnet)                                                             |
| 接入示例      | [SampleConsole](https://github.com/FeatureProbe/server-sdk-dotnet/tree/main/samples/FeatureProbe.Server.Sdk.SampleConsole) (Console) |
| 接入示例      | [SampleApi](https://github.com/FeatureProbe/server-sdk-dotnet/tree/main/samples/FeatureProbe.AspNet.Sdk.SampleApi) (Asp.NET)         |
| 已发布模块    | [NuGet (FeatureProbe.Server.Sdk)](https://www.nuget.org/packages/FeatureProbe.Server.Sdk)                                            |
| 已发布模块    | [NuGet (FeatureProbe.AspNet.Sdk)](https://www.nuget.org/packages/FeatureProbe.AspNet.Sdk)                                            |

:::

:::tip
对于首次使用 FeatureProbe 的用户，我们强烈建议你在阅读过[灰度放量教程](../../tutorials/rollout_tutorial/)之后，再回到这篇文章继续阅读。
:::

## 接入业务代码

后端项目通常只需要实例化一个 FeatureProbe SDK（Client）。
然后针对不同用户的请求，调用 FeatureProbe Client 获取对每一个用户的开关处理结果。

:::info
服务端 SDK 采用异步连接 FeatureProbe 服务器拉取判定规则的方式，判定规则会在本地存缓。所有对用户代码暴露的接口都只涉及内存操作，调用时不必担心性能问题。
:::

### 步骤 1. 安装 FeatureProbe SDK

首先，在您的应用程序中安装 FeatureProbe SDK 作为依赖项。

#### NuGet

```shell
dotnet add package FeatureProbe.Server.Sdk
```

:::info
对于 Asp.NET 应用程序，您可以使用 [FeatureProbe.AspNet.Sdk](https://www.nuget.org/packages/FeatureProbe.AspNet.Sdk)。

```shell
dotnet add package FeatureProbe.AspNet.Sdk
```

:::

### 步骤 2. 创建一个 FeatureProbe instance

安装并导入 SDK 后，创建 FeatureProbe sdk 的单个共享实例。

```csharp
using FeatureProbe.Server.Sdk;

public class Program
{
    public static void Main()
    {
        var config = new FPConfig.Builder()
            .ServerSdkKey("server-8ed48815ef044428826787e9a238b9c6a479f98c")
            .RemoteUrl("http://localhost:4009/server")
            .StreamingMode()
            .Build();

        using var fp = new FPClient(config, -1);
        Console.WriteLine(fp.Initialized);
    }
}
```

:::info
对于 Asp.NET 程序，在 `appsettings.json` 中设置配置项：

```json
{
  "FeatureProbe": {
    "RemoteUrl": "http://localhost:4009/server",
    "SdkKey": "server-8ed48815ef044428826787e9a238b9c6a479f98c",
    "RefreshInterval": 5,
    "StartWait": 200
  }
}

| config          | describe                                                    |                                        required |
| :-------------- | :---------------------------------------------------------- | ----------------------------------------------: |
| SdkKey          | 当前环境 SDK KEY                                             |                                               Y |
| RemoteUrl       | 单独部署的FeatureProbe后端Url                                 |             N 如已提供RemoteUrl和SynchronizerUrl |
| EventUrl        | 事件上传Url                                                  |                             Y 如未提供 RemoteUrl |
| SynchronizerUrl | 开关数据同步Url                                               |                             Y 如未提供 RemoteUrl |
| RealtimeUrl     | 实时开关数据同步Url                                            |                                               N |
| RefreshInterval | 开关数据同步频率（s）                                           |                                               N |
| StartWait       | 程序启动时初始化阻塞时间（毫秒）                                  |                                               N |

注册 FeatureProbe 服务：

```csharp
// Program.cs

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddFeatureProbe(builder.Configuration.GetSection("FeatureProbe"));
```

并通过依赖注入获取 `FPClient` 实例。
:::

### 步骤 3. 使用 FeatureProbe 开关获取设置的值

您可以使用 sdk 拿到对应开关名设置的值。

```csharp
var user = new FPUser();
user.With("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);

var boolValue = fp.BoolValue("YOUR_TOGGLE_KEY", user, false);
if (boolValue) /* the code to run if the toggle is on */
else /* the code to run if the toggle is off */
```

### 步骤 4. 程序退出前关闭 FeatureProbe Client

退出前关闭 client，保证数据上报准确。

```csharp
fp.Dispose();
// or
await fp.DisposeAsync();
// or automatically dispose
using var fp = new FPClient(config, -1);
```

## 事件上报

事件跟踪功能可以将用户在应用程序中采取的操作记录为事件。
可以在开关的指标中关联事件。更多指标分析相关的信息，请阅读[指标分析](../../tutorials/analysis)。

```csharp
fp.Track("YOUR_CUSTOM_EVENT_NAME", user);
// Providing a metric value to track
fp.Track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
```

## 接入业务单元测试

FeatureProbe SDK 提供了一套 mock 机制，可以在单元测试中指定 FeatureProbe SDK 的返回值。

### 1. 项目中添加 Mock 工具:

```shell
dotnet add package Moq
```

### 2. Mock FeatureProbe 开关

#### 被测函数

```csharp
[ApiController]
[Route("/domo")]
public class DemoController : ControllerBase
{
    private readonly FPClient _fpClient;

    public DemoController(FPClient fpClient)
    {
        _fpClient = fpClient;
    }

    [HttpGet]
    public FPDetail<bool> Get([FromQuery] string userId)
    {
        var user = new FPUser().With("userId", userId);
        return _fpClient.BoolDetail("campaign_allow_list", user, false);
    }
}
```

#### 单测 Code

```csharp
[TestClass]
public class DemoControllerTest
{
    [TestMethod]
    public void TestGet()
    {
        var mock = new Mock<FPClient>();
        mock.Setup(fp => fp.BoolDetail("campaign_allow_list", It.IsAny<FPUser>(), false))
            .Returns(new FPDetail<bool>(true, 0, 0, "mocked"));
        var controller = new DemoController(mock.Object);
        var result = controller.Get("test");
        Assert.IsTrue(result.Value);
    }
}
```

## 定制化开发本 SDK

:::tip
本段落适用于想自己定制化开发本 SDK，或者通过开源社区对本 SDK 贡献代码的用户。一般用户可以跳过此段内容。
:::

我们提供了一个本 SDK 的验收测试，用于保证修改后的 SDK 跟 FeatureProbe 的原生规则兼容。
集成测试用例作为每个 SDK 存储库的子模块添加。所以在运行测试之前，请务必先拉取子模块以获取最新的集成测试。

```shell
git submodule update --init --recursive
dotnet test
```
