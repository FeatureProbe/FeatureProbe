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



### 1.4 接入引导提示 “您没有此 SDK 密钥连接成功的应用程序” 该如何排查？

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
      wait_first_resp: true,
  };
  ~~~
  
  </TabItem>
  <TabItem value="python" label="Python">
  
  ~~~python title="demo.py"
  config = fp.Config(remote_uri=remote_url,
                     sync_mode='pooling',
                    # highlight-start
                     refresh_interval=5) #seconds
   									# highlight-end
  ~~~
  
  </TabItem>
  <TabItem value="JavaScript" label="JavaScript">
  
  ~~~js title="demo.js"
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
  
  ~~~js title="demo.js"
  fpClient.init({
    remoteUrl: /* remoteUrl */,
    clientSdkKey: /* clientSdkKey */
    user: /* user */
    // highlight-start
    timeoutInterval: 5000, // 5 seconds
    // highlight-end
  })
  ~~~
  
  </TabItem>

  </Tabs>


- 前端SDK可以监听SDK是否发布的 `error` 事件，同时在浏览器控制台也可以看到错误详情：

  <Tabs groupId="language">
  <TabItem value="JavaScript" label="JavaScript">
  
  ~~~js title="demo.js"
  fp.on("error", function() {
    console.log("JavaScript SDK初始化报错了！")
  })
  ~~~
  
  </TabItem>

   <TabItem value="MiniProgram" label="MiniProgram">
  
  ~~~js title="demo.js"
  fpClient.on("error", function() {
    console.log("MiniProgram SDK初始化报错了！")
  })
  ~~~
  
  </TabItem>

  </Tabs>




## 二. 部署问题

