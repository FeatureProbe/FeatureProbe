---
slug: FeatureProbe Longlink2
title: 长连接实践方案（下）
---

在上一篇文章，我们讲到了长连接常见的实现方案，相信大家对长连接已经有一定的了解了，这篇文章我们会讲 FeatureProbe 的长连接实现方案。

# 一、为什么FeatureProbe需要长连接  

Feature Toggle 在部分场景下，客户端对实时性有较高的要求，如紧急情况，希望配置立刻下发生效。有的 Feature 在 Web 端加载或 App 启动的时候就要读取到开关的值，虽然缓存能解决一部分问题，但是最快拿到最新的值，会更符合用户的预期。我们在上篇有提到过，长连接可以解决数据推送和请求优化这两个场景。

 ### 1、可选协议

-   **SSE** ：Server Send Event 能满足服务端向客户端发送数据的需求，协议简单，但因为不是双工的数据通路后期无法实现 HTTP 的请求优化。
-   **TCP** ：目前最主流的长连接协议，配合 TLS 1.3 可以做到很好的使用效果。
-   **QUIC** ：本身握手和 TLS1.3 融合，还支持连接恢复，多Stream避免包头阻塞问题，有很多优势，因为基于UDP，可能会有部分特殊网络环境被禁止。
-   **UDP** ：需要自己实现丢包重传，部分网络环境有可能被限制。
-   **WebSocket** ：对浏览器友好，小程序唯一支持的双向收发 (全双工) 协议，很难做连接优化。


### 2、设计目标

-   尽可能支持更多的端，小程序，移动端，多种语言服务端；
-   尽量降低 SDK 的实现复杂度，方便后期社区贡献；
-   尽可能使开关快速生效；
-   尽可能低的数据传输量。

# 二、FeatureProbe长连接方案

### 1、协议选择 WebSocket

小程序是我们一期要优先支持的平台，所以所有不支持小程序的协议都不在一期的考虑范围内。

-   **优点**：是可以支持小程序和浏览器环境，小程序是我们优先要支持的部分，在国内的重要性非常高，很多创业团队甚至只开发小程序的 APP 版本。
-   **缺点**：是连接建立的优化很难进行．在国内网络环境整体较好的情况下，大部分的请求还是在较快的响应范围之内．我们可以在后面二期的时候再针对其他端做多协议切换。

我们在  Websocket 的基础上进一步选择了 Socektio 这个网络库:

-   **优点**：是在 WebSocket 的基础上提供了断开重连，发送缓冲，消息确认，广播，整体的编解码逻辑简单，提供了长轮询(long polling)的回退方案，在不支持 WebSocket 的设备上也能兼容。

-   **缺点**：客户端有限，老项目已经比较成熟，目前已经不太活跃。

### 2、服务端推送

FeatureProbe Server 发现开关更新后，发送事件给关心这个开关的连接，对端的 SDK 收到事件，触发一次开关拉取。这里面能做的优化是直接下发开关的值，因为 Server SDK 和 Client SDK 的处理逻辑不同，我们放到下个迭代优化。

-   **如何发现变化**：开关的规则是存储在 FeatureProbe API 服务中的，目前 FeatureProbe Server 通过接口周期性访问得到，直观的想法是轮询时，去 diff 开关的值，就可以发现变化，但是效率比较低。因为 SDK 是针对项目环境下所有的开关进行获取，这里环境的 SDK KEY 拉取整体的开关规则时，添加一个 version 就可以判断两次之间是否一致。

-   **如何表示 SDK 对某个开关感兴趣**: 目前 SDK 向 Featureprobe Server 获取开关，是以 SDK_KEY 为粒度的。在 SocketIO 连接建立后，SDK 会向 Server 注册 SDK_KEY, Server 就可以把这个连接存储在相同 SDK KEY 的列表中，等有开关发生变化，Server 知道开关是发生在哪个 SDK_KEY 中，把 对应 SDK_KEY 列表中所有的连接都发送一个更新事件，就完成了变更的通知。实际实现利用了SocketIO 提供了 [Room](https://socket.io/docs/v3/rooms/) 的概念，仅需把连接和 SDK KEY做一下关联，变更时直接对 SDK_KEY 发送事件就可以了。

**代码示意：**

```
import { createServer } from "http";
import { Server } from "socket.io";
const httpServer = createServer();
const io = new Server(httpServer);
io.on("register", (sdk_key, socket) => {
socket.join(sdk_key);
});
httpServer.listen(3000);
// notify clients 
io.to(SDK_KEY).emit("update");
```
### 3、客户端接收  

FeatureProbe SDK 目前是 pull 模式和服务端通信，即启动后通过轮询来周期性获取全量开关的数据。在 SocketIO 的帮助下，添加 push 的模式很简单。在原有基础上初始化 SocketIO 的客户端，连接建立后把 SDK KEY 发送给 Server, 然后监听一个 Server 下发的 update 事件，收到事件就立刻触发一次开关全量的拉取。断开重连，心跳，回调等都交给 SocketIO 来做。这里有个优化是下发的数据可以是开关变更的数据，而不仅仅是变更事件，这个也是我们后续准备做的工作。

# 三、最终实现

FeatureProbe Server 是 Rust 语言实现的，考虑到后续的性能和扩展性等原因，我们不想再引入一个 nodejs 的模块专门做长连接的管理，所以我用 **Rust** 实现了 SocketIO 的服务端 [socketio-rs](https://github.com/socket-iox/socket-io)（实现的rust方案已经开源到GitHub，点击[socketio-rs](https://github.com/socket-iox/socket-io)可访问），实际的 FeatureProbe [客户端业务代码](https://github.com/FeatureProbe/server-sdk-rust/blob/44e971551c8bc10069014b3797a735df20fdde8a/src/feature_probe.rs#L251-L280)和[服务端业务代码](https://github.com/FeatureProbe/FeatureProbe/blob/main/server/src/realtime.rs)都相对比较简洁。

目前FeatureProbe 使用 Apache 2.0 License 协议已经完全开源。你可以从 [GitHub](https://github.com/FeatureProbe/FeatureProbe) 或 [Gitee](https://gitee.com/featureprobe/FeatureProbe) 上搜索FeatureProbe获取到所有源代码。
