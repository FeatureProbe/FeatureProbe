---
slug: FeatureProbe Longlink
title: 长连接实践方案（上）
---

## 一、什么是长连接？  

长连接可以指 HTTP 持久连接 ([persistent connection](https://zh.m.wikipedia.org/zh-hans/HTTP%E6%8C%81%E4%B9%85%E8%BF%9E%E6%8E%A5))，也可以指基于 TCP / UDP / QUIC / WebSocket 等一个或多个协议建立后可以持续收发消息的数据通路。本文主要介绍的是后者，其中以微信2017年初开源的 Mars 被大家熟知。从 [Mars](https://github.com/Tencent/mars) 的 [issue](https://github.com/Tencent/mars/issues/11) 中我们可以看到 Longlink 这个国内长连接的直译，目前还没有特别好的英文术语。实际上 Mars 只是长链接架构中的客户端，还需要一个服务端来配合。

![long1.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d7acfa50d3348658401afa53d29ba12~tplv-k3u1fbpfcp-watermark.image?)

## 二、国内长连接现状


目前国内的大厂基本上都有自己的网关团队，长连接服务是网关中的子服务，客户端团队负责端上的网络库（如 Mars），网关相关的公开资料可以查询到的如阿里的 [ACCS](https://pic.huodongjia.com/ganhuodocs/2017-07-01/1498898745.33.pdf) ，美团的 [Shark](https://zhuanlan.zhihu.com/p/33179166) 等

提供了诸如 消息推送，消息广播，多协议切换，HTTP代理，多接入点容灾等功能。可覆盖 即时通讯，弹幕，互动游戏，竞拍等多个业务。


## 三、长连接解决的问题

总的来说主要解决的数据实效性的问题：

### 1、数据推送

最常见的案例就是消息通知。

-   最简单的做法是启动一个计时器，周期性轮询（polling ）一个接口。这种方案常见于早期基于浏览器的项目。坏处是间隔设置的太长用户体验不好，设置间隔太短后端服务会进行大量的无效查询。

-   稍好一点的做法是使用长轮询（long polling）,发送 HTTP 请求后，如果没有新数据，服务端就一直不返回 HTTP 的 response。这种方式减少了大量无效的查询，但是如果新数据频繁，会进行大量的连接建立和关闭。常见于早期浏览器 WebSocket 协议支持不完整的时候。

-  目前主流的方案是浏览器基于 WebSocket，移动端基于 TCP / UDP/ QUIC 的全双工数据通道的方案。一次连接建立，服务端维护连接和业务的对应关系（如用户id），当用户有新数据时，找到对应的连接，将数据发送出去，浏览器或者移动端就可以立刻收到消息，返回给上层。

可以推测手机厂商给 APP 提供的离线消息推送的通道，如果想做到最好的实时性，也需要维护一个手机和厂商服务的连接，在 APP 后端发送推送后，厂商转发给手机，展示给用户。


![long2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/820decf4f52c40bd982d4f6ae6055f19~tplv-k3u1fbpfcp-watermark.image?)


### 2、请求优化

大多数业务的API请求还是基于 HTTP(S) 的，在大多数情况下，国内网络质量良好。少部分的网络优化场景可以代理 HTTP(S) 的请求将会是更具有性价比的方案。

常见的方案是移动端的网络库代码中，添加一个拦截逻辑，把请求的参数重新封装成底层报文，通过全双工的数据通路发送给网关，网关组装成 HTTP 的请求，在内网发送给对应的业务服务器，再把返回封装后发送给对应的数据通道。

一次完整的 HTTPS 请求的步骤包括：

![long3.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd4b843c690149c483dfb5c7725ca039~tplv-k3u1fbpfcp-watermark.image?)

在海量用户请求的情况下，任何一个环节都可能出错，导致请求失败。如 DNS 污染，错配导致解析错误，或者返回慢。用户在山区或者海外，数据包来回（RTT）延迟大，握手环节过于复杂，证书过大，超时配置不合理，包过小导致慢启动阶段过慢，数据带宽利用不足等。

-   复用之前建立的底层连接，持续地发送和接收 HTTP 请求，将会节省很多时间。
-   直接用 IP 连接，自己通过 HTTPS 接口下发 域名的 IP 地址，就绕过了 DNS 解析的环境，也避免 DNS 被污染的问题。
-   使用更高版本的 TLS 协议，或者使用 QUIC 协议，可以减少建立连接的握手次数。


![long4.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a238af1332142eab14ea0a16dff82a8~tplv-k3u1fbpfcp-watermark.image?)

我们以 RTT 为 200ms 举例，采用 TCP + TLS 1.2 的请求首次需要至少 600ms 才能建立连接，打开TLS会话复用需要 400ms，采用 TCP + TLS 1.3 的首次请求 400ms 就可以连接上，复用是200ms，采用 QUIC 协议的话首次是 200ms，复用是 0ms，具体协议的细节超过了本文的范围，当用户处于弱网环境，这个 RTT 可能更差，可见协议的优化就可以带来更好的响应。 

本文是长连接介绍的上篇，主要介绍了网上公开的业界长连接技术方案。下篇将会介绍如何针对自己的业务选择合适的技术方案。

目前我们实现长链接的方案已经完全开源。你可以从 [GitHub](https://github.com/socket-iox/socket-io) 获取到所有源代码。

**关于FeatureProbe**

我们一款新型交付功能管理发布平台，通过FeatureProbe的功能管理平台可以对产品功能粒度进行精细化验证和交付。

目前 FeatureProbe 使用 Apache 2.0 License 协议已经完全在[GitHub](https://github.com/FeatureProbe "GitHub")和[Gitee](https://gitee.com/featureprobe "Gitee")开源。

如果大家喜欢我们的项目，欢迎在GitHub 和 Gitee 上给我们点个小星星，需要你们的支持和鼓励。

