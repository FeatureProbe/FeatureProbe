---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



# 常见问题 FAQ

这里记录了 FeatureProbe 使用过程中的常见问题及解决方案。

## 一. 通用问题
### 1.1 FeatureProbe 流量是怎么控制的(StableRollout Key 是什么 )?

- StableRollout Key 值是按百分比放量的唯一依据，非必传参数，仅在使用了*百分比放量*时才有用。
- 使用了百分比放量，且未传入该 Key，则每次访问 SDK 时以当前时间戳作为 StableRollout Key 来划分流量分组。
- 使用了百分比放量，建议传入任何能够唯一标识此次请求的 id 作为 StableRollout Key 值。FeatureProbe 不关心传入的 Key 值语意，只是把它当做任意字符串看待，需要用户自行根据配置约定保证传参质量。例如：如果传入的 key 是 username，那么流量就是按 username 划分；如果传入的是固定值，那么进入的分组不变。
- 具体使用可查看教程：[按百分比灰度放量](/tutorials/rollout_tutorial/)



### 1.2 如何保证同一个用户总是进入相同的组？

- 如果传入 FeatureProbe SDK 的 StableRollout Key 不变，流量的准入/分组规则配置不变，那么用户将恒定进入某个组，这是 FeatureProbe 的默认行为，不需要特殊配置。




### 1.3 怎么通过接口修改 FeatureProbe 开关信息？

- FeatureProbe 提供 Open API 可对项目、开关（查询、创建、修改、发布等）及环境等信息管理，涵盖目前 FeatureProbe 管理后台上所有功能操作。详情可查看 [OpenAPI 文档](https://featureprobe.io/api-docs)。



### 1.4 接入引导提示 “您没有 *x* 应用程序在 *x* 环境中监听 *x* 开关。” 该如何排查？

- 检查  `RemoteURL` 和 `ServerSdkKey` 或 `ClientSdkKey` 与当前访问开关所在环境是否一致：

  - RemoteUrl
    - 官方测试环境： https://featureprobe.io/server
    - Docker-compose 环境： http://{运行 docker compose 机器IP地址}:4007
    - Docker image 部署或编译部署： http://{FEATURE_PROBE_SERVER_IP}:{FP_SERVER_PORT}
  - ServerSdkKey: *<[如何获取 ServerSdkKey](/tutorials/backend_custom_attribute#编写代码)>*
  - ClientSdkKey: *<[如何获取 ClientSdkKey](/tutorials/backend_custom_attribute#控制前端程序)>*

- 检查 FeatureProbe Server 服务是否正常：

  - 官方测试环境：`ping featureprobe.io` 是否有超时或丢包严重，可调整 SDK 超时时间。

  - Docker 环境或编译部署环境:

    ```bash
    curl "http://{FEATURE_PROBE_SERVER_IP}:{FP_SERVER_PORT}"
    
    <h1>Feature Probe Server</h1> # <- 显示该信息则表示服务正常
    ```

- 尝试调整 SDK 连接 FeatureProbe Server  的超时时间(如调整为 5秒)：

  <Tabs groupId="language">
     <TabItem value="java" label="Java" default>

  ~~~java  title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
  private static final FPConfig config = FPConfig.builder()
          .remoteUri(remoteUri)
          // highlight-start
    		.pollingMode(Duration.ofSeconds(5L))
          // highlight-end
          .build();
  ~~~
  
    </TabItem>
    <TabItem value="golang" label="Go">
  
  ~~~go title="example/main.go"
  config := featureprobe.FPConfig{
      RemoteUrl:       RemoteUrl,
      ServerSdkKey:    ServerSdkKey,
      // highlight-start
      RefreshInterval: 5000, // ms
      // highlight-end
  }
  ~~~

  </TabItem>
  <TabItem value="rust" label="Rust">
  
  ~~~rust title="examples/demo.rs"
  let config = FPConfig {
      remote_url: remote_url,
      server_sdk_key: server_sdk_key,
    // highlight-start
      refresh_interval: Duration::from_secs(5),
    // highlight-end
  };
  ~~~
  
  </TabItem>
  <TabItem value="python" label="Python">
  
  ~~~python title="demo.py"
  config = fp.Config(remote_uri=remote_url,
                     sync_mode='polling',
                    # highlight-start
                     refresh_interval=5) #seconds
   									# highlight-end
  ~~~
  
  </TabItem>
  <TabItem value="nodejs" label="Node.js">

  ~~~js title="example/demo.js"
  const fp = new featureProbe.FeatureProbe({
    remoteUrl: FEATURE_PROBE_SERVER_URL,
    serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,
    // highlight-start
    timeoutInterval: 5000,
    // highlight-end
  });
  ~~~
  </TabItem>
  <TabItem value="JavaScript" label="JavaScript">
  
  ~~~js title="example/index.html"
  const fp = new FeatureProbe({
    remoteUrl: /* remoteUrl */,
    clientSdkKey: /* clientSdkKey */
    user: /* user */
    // highlight-start
    timeoutInterval: 5000, // 5 seconds
    // highlight-end
  })
  ~~~
  
  </TabItem>

  <TabItem value="MiniProgram" label="MiniProgram">
  
  ~~~js title="example/app.js"
  import { initialize } from "featureprobe-client-sdk-miniprogram";

  const fp = initialize({
    remoteUrl: /* remoteUrl */,
    clientSdkKey: /* clientSdkKey */,
    user: /* user */,
    // highlight-start
    timeoutInterval: 5000, // 5 seconds
    // highlight-end
  })
  ~~~
  
  </TabItem>
  <TabItem value="React" label="React">
  
  ~~~js title="demo.tsx"
  <FPProvider 
    config={{
      remoteUrl: /* remoteUrl */,
      clientSdkKey: /* clientSdkKey */,
      user:  /* user */,
      // highlight-start
      timeoutInterval: 5000, // 5 seconds
      // highlight-end
    }}
  >
    <div className="App"></div>
  </FPProvider>
  ~~~
  
  </TabItem>

  </Tabs>


- 前端SDK可以监听SDK是否发布的 `error` 事件，同时在浏览器控制台也可以看到错误详情：

  <Tabs groupId="language">
  <TabItem value="JavaScript" label="JavaScript">
  
  ~~~js title="example/app.js"
  fp.on("error", function() {
    console.log("JavaScript SDK初始化报错了！")
  })
  ~~~
  
  </TabItem>

  <TabItem value="MiniProgram" label="MiniProgram">

  ~~~js title="example/app.js"
  fp.on("error", function() {
    console.log("Error initing MiniProgram SDK!")
  })
  ~~~

  </TabItem>
  <TabItem value="React" label="React">

  ~~~js title="example/provider/src/components/HookComponent.tsx"
  import { useFPClient } from 'featureprobe-client-sdk-react';

  const fp = useFPClient();

  fp.on("error", function() {
    console.log("Error initing React SDK!")
  })
  ~~~

  </TabItem>

  </Tabs>

### 1.5 接入引导提示 “您没有 *x* 应用程序在 *x* 环境中监听 *x* 事件。” 该如何排查？

- 请先需确保测试应用程序中显示 *"✅ SDK连接成功"*，如提示 *“您没有此 SDK 密钥连接成功的应用程序”*，请先按照 [1.4](/introduction/faq#14-接入引导提示-您没有此-sdk-密钥连接成功的应用程序-该如何排查) 对应的步骤进行排查。

- 确认指标的收集数据是已开启状态，操作方式见：[配置指标并开始收集数据](/tutorials/analysis#%E9%85%8D%E7%BD%AE%E6%8C%87%E6%A0%87%E5%B9%B6%E5%BC%80%E5%A7%8B%E6%94%B6%E9%9B%86%E6%95%B0%E6%8D%AE)

- 如指标的事件类型是“自定义事件”，需要通过 SDK 提供的 `track` 函数上报事件数据，调用函数如下所示：

  服务端SDK：

  <Tabs groupId="language">
     <TabItem value="java" label="Java" default>

    ~~~java  title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
    fpClient.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
    ~~~

    </TabItem>

    <TabItem value="golang" label="Go">
  
    ~~~go title="example/main.go"
    value := 99.9
    fp.track("YOUR_CUSTOM_EVENT_NAME", user, &value);
    ~~~

    </TabItem>

     <TabItem value="rust" label="Rust">

    ~~~rust title="examples/demo.rs"
    fpClient.track("YOUR_CUSTOM_EVENT_NAME", &user, Some(5.5));
    ~~~

    </TabItem>
    <TabItem value="python" label="Python">
  
    ~~~python title="demo.py"
    fp.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
    ~~~
    
    </TabItem>
    <TabItem value="nodejs" label="Node.js">

    ~~~js title="example/demo.js"
    fp.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
    ~~~
    
    </TabItem>

  </Tabs>

  客户端SDK：

  <Tabs groupId="language">

    <TabItem value="JavaScript" label="JavaScript">

    ~~~js title="example/index.html"
    fp.track('YOUR_CUSTOM_EVENT_NAME', 5.5);
    ~~~
    
    </TabItem>

    <TabItem value="Android" label="Android">

    ~~~bash
    fp.track("YOUR_CUSTOM_EVENT_NAME", 5.5)
    ~~~
    
    </TabItem>

    <TabItem value="Swift" label="Swift">

    ~~~bash
    fp.track(event: "YOUR_CUSTOM_EVENT_NAME", value: 5.5)
    ~~~
    
    </TabItem>

    <TabItem value="Objective-C" label="Objective-C">

    ~~~bash
    [fp trackWithEvent:@"YOUR_CUSTOM_EVENT_NAME" value:5.5];
    ~~~
    
    </TabItem>

    <TabItem value="MiniProgram" label="MiniProgram">

    ~~~js title="example/app.js"
    featureProbeClient.track('YOUR_CUSTOM_EVENT_NAME', 5.5);
    ~~~
    
    </TabItem>

    <TabItem value="React" label="React">

    ~~~js title="example/provider/src/components/HookComponent.tsx"
    import { useFPClient } from 'featureprobe-client-sdk-react';

    const fp = useFPClient();

    fp.track('YOUR_CUSTOM_EVENT_NAME', 5.5);
    ~~~
    
    </TabItem>

  </Tabs>

  需要注意的是 `YOUR_CUSTOM_EVENT_NAME` 必须和指标中的 “事件名称” 保持一致。 


- 如指标的事件类型是 “页面事件” 或 “点击事件”，请使用 JavaScript 和 React SDK 接入*（无须手工上报事件）*，并且检查指标中所设置 “目标页面URL” 和需要上报事件的页面 URL 是否匹配。其中 “点击事件” 还需要保证所设置“点击元素” 的 CSS 选择器和实际访问页面的元素的 path 是否匹配。




## 二. 部署问题

编写中。

## 三. 分析诊断

### 3.1 无分流数据
分流数据是 SDK 求值过程中自动上报的，如果诊断没有分流数据，可能的原因为：
  - 没有求值，如没调用类似 `fpClient.boolValue(YOUR_TOGGLE_KEY, user, false)` 的代码
  - 上报URL错误，如 SDK 接入 URL 配置错误，无法上报数据

### 3.2 无事件数据
事件数据需要主动调用track方法，如果没有时间数据，可能的原因为：
  - 没有调用类似 `fpClient.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);` 的代码追踪事件
  - 上报URL错误，如 SDK 接入 URL 配置错误，无法上报数据



### 3.3 无Join数据
Join数据是分流数据和事件数据通过相同的 user_id 进行关联，如果没有Join数据，可能的原因为：
 - 分流的数据和事件数据的 user_id 无法对应
