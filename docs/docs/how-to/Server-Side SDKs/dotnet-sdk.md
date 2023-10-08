---
sidebar_position: 1
---

# .NET SDK

FeatureProbe is an open source feature management service. This SDK is used to control features in .NET programs. This SDK is designed primarily for use in multi-user systems such as web servers and applications.

:::note SDK quick links

In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**          | **Location**                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| SDK API documentation | [ SDK API docs](https://featureprobe.github.io/server-sdk-dotnet/)                                                                   |
| GitHub repository     | [Server-SDK for .NET](https://github.com/FeatureProbe/server-sdk-dotnet)                                                             |
| Sample applications   | [SampleConsole](https://github.com/FeatureProbe/server-sdk-dotnet/tree/main/samples/FeatureProbe.Server.Sdk.SampleConsole) (Console) |
| Sample applications   | [SampleApi](https://github.com/FeatureProbe/server-sdk-dotnet/tree/main/samples/FeatureProbe.AspNet.Sdk.SampleApi) (Asp.NET)         |
| Published module      | [NuGet (FeatureProbe.Server.Sdk)](https://www.nuget.org/packages/FeatureProbe.Server.Sdk)                                            |
| Published module      | [NuGet (FeatureProbe.AspNet.Sdk)](https://www.nuget.org/packages/FeatureProbe.AspNet.Sdk)                                            |

:::

:::tip
For users who are using FeatureProbe for the first time, we strongly recommend that you return to this article to continue reading after reading the [Gradual Rollout Tutorial](../../tutorials/rollout_tutorial/).
:::

## Step-by-Step Guide

Backend projects usually only need to instantiate a FeatureProbe SDK (Client).

According to the requests of different users, call the FeatureProbe Client to obtain the toggle result for each user.

:::info
The server-side SDK uses an asynchronous connection to the FeatureProbe server to pull judgment rules, and the judgment rules will be cached locally. All interfaces exposed to user code only involve memory operations, so there is no need to worry about performance issues when calling.
:::

### Step 1. Install the DotNet SDK

First, install the FeatureProbe SDK as a dependency in your application.

#### NuGet

```shell
dotnet add package FeatureProbe.Server.Sdk
```

:::info
For Asp.NET applications, you can use the adaptive sdk [FeatureProbe.AspNet.Sdk](https://www.nuget.org/packages/FeatureProbe.AspNet.Sdk).

```shell
dotnet add package FeatureProbe.AspNet.Sdk
```

:::

### Step 2. Create a FeatureProbe instance

After you install and import the SDK, create a single, shared instance of the FeatureProbe sdk.

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
For Asp.NET applications, place the configuration in `appsettings.json`:

```json
{
  "FeatureProbe": {
    "RemoteUrl": "http://localhost:4009/server",
    "SdkKey": "server-8ed48815ef044428826787e9a238b9c6a479f98c",
    "RefreshInterval": 5,
    "StartWait": 200
  }
}
```

| config          | describe                                                    |                                        required |
| :-------------- | :---------------------------------------------------------- | ----------------------------------------------: |
| SdkKey          | current environment SDK KEY                                 |                                               Y |
| RemoteUrl       | url for a standalone backend                                | N if RemoteUrl and SynchronizerUrl are provided |
| EventUrl        | events upload Url                                           |                  Y if RemoteUrl is not provided |
| SynchronizerUrl | toggle data synchronization Url                             |                  Y if RemoteUrl is not provided |
| RealtimeUrl     | toggle data synchronization Url (streaming)                 |                                               N |
| RefreshInterval | data synchronization frequency（s）                         |                                               N |
| StartWait       | block waiting while starting the application (milli second) |                                               N |

Then obtain a `FPClient` by dependency injection.
:::

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```csharp
var user = new FPUser();
user.With("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);

var boolValue = fp.BoolValue("YOUR_TOGGLE_KEY", user, false);
if (boolValue) /* the code to run if the toggle is on */
else /* the code to run if the toggle is off */
```

### Step 4. Dispose FeatureProbe Client before program exits

For FeatureProbe.Server.Sdk, you need to dispose the client manually before exiting to ensure accurate data reporting.

```csharp
fp.Dispose();
// or
await fp.DisposeAsync();
// or automatically dispose
using var fp = new FPClient(config, -1);
```

## Track Events

The event tracking feature can record the actions taken by the user in the application as events.

Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).

```csharp
fp.Track("YOUR_CUSTOM_EVENT_NAME", user);
// Providing a metric value to track
fp.Track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
```

## Mock FeatureProbe for Unit test

You can mock FeatureProbe SDK returned value, to run unit test of your code.

### 1. Add a mock tool to your project:

```shell
dotnet add package Moq
```

### 2. Mock Toggle

#### Target Method

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

#### Unit Test Code

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

## Customize SDK

:::tip
This paragraph applies to users who want to customize this SDK, or contribute code to this SDK through the open source community. Other users can skip this section.
:::

We provide an acceptance test of this SDK to ensure that the modified SDK is compatible with the native rules of FeatureProbe.
Integration test cases are added as submodules of each SDK repository. So be sure to pull the submodule first to get the latest integration tests before running the tests.

```shell
git submodule update --init --recursive
dotnet test
```
