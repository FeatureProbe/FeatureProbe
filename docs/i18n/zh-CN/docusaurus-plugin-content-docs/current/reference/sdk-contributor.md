---
sidebar_position: 4
---

# SDK 贡献指南

## 概述

本文档旨在介绍 FeatureProbe SDK 的工作原理，以帮助那些想要为 FeatureProbe 创建新的 SDK，或为现有 SDK 做出贡献的人。
我们的所有 SDK 都是开源的，我们也欢迎社区成员为其做出贡献。

## 架构

所有 SDK 必须包含如下组件：

 - [接收开关的变更](#接收开关的变更)
 - [评估开关的结果](#评估开关的结果)
 - [上报事件](#上报事件)



## 接收开关的变更

FeatureProbe SDK 将所有的开关都存储在内存中。目前提供两种不同的方式来对开关进行更新：异步轮询和长连接。对于已经支持长连接的 SDK，默认会选择长连接的更新方式。异步轮询的更新实现是必须的，因为长连接实现依赖异步轮询来进行最后的兜底。

在开关的存储方面，服务端SDK 和客户端SDK 有不同的实现。服务端SDK 直接将开关规则存储在内存中。而客户端SDK 由于数据安全性问题和用户相对固定，存储的是已经评估好的开关结果。

### 服务端 SDK 接收开关变更

当我们通过 FeatureProbe 平台或者 Open API 对开关的配置做出变更时, 服务端SDK 需要对内存中保存的开关规则进行更新。目前需提供如下两种实现：

 1、**通过异步轮询获取开关规则**

Server获取开关配置API协议：
```shell
curl --location --request GET 'https://featureprobe.io/server/api/server-sdk/toggles' \
--header 'Authorization: server-9e53c5db4fd75049a69df8881f3bc90edd58fb06'   
```
响应协议示例:
```json
{
    "segments": {
        "some_segment": {
            "key": "some_segment1",
            "uniqueId": "some_segment1-fjoaefjaam",
            "version": 2,
            "rules": [
                {
                    "conditions": [
                        {
                            "type": "string",
                            "subject": "city",
                            "predicate": "is one of",
                            "objects": [
                                "4"
                            ]
                        }
                    ]
                }
            ]
        }
    },
    "toggles": {
        "bool_toggle": {
            "key": "bool_toggle",
            "trackAccessEvents": true,
            "lastModified": 1678180913,
            "enabled": true,
            "version": 1,
            "disabledServe": {
                "select": 1
            },
            "defaultServe": {
                "select": 0
            },
            "rules": [
                {
                    "serve": {
                        "select": 0
                    },
                    "conditions": [
                        {
                            "type": "string",
                            "subject": "city",
                            "predicate": "is one of",
                            "objects": [
                                "1",
                                "2",
                                "3"
                            ]
                        }
                    ]
                },
                {
                    "serve": {
                        "select": 1
                    },
                    "conditions": [
                        {
                            "type": "segment",
                            "subject": "user",
                            "predicate": "in",
                            "objects": [
                                "some_segment1-fjoaefjaam"
                            ]
                        }
                    ]
                }
            ],
            "variations": [
                true,
                false
            ]
        }
    }
}
```

- 该 API 需要使用 HTTP 请求头将 Authorization 设置为 `sdk_key`，以便在轮询API时进行身份验证。其中 `sdk_key` 是客户端应用程序传递给    FeatureProbe 配置的 Server SDK 密钥。

- 实现异步轮询机制，可以使用定时器或轮询库来定期发送HTTP请求以获取最新的开关规则，建议默认频率为5s。
    
- 将轮询 API 的请求地址（synchronizerUrl）和轮询频率（refreshInterval）作为配置项通过 FPConfig 提供给用户，使得用户可以自定义轮询频率和请求地址。

***可供参考的代码[异步轮询Java实现](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/server/PollingSynchronizer.java)***

 2、**通过长链接获取开关变更事件然后主动触发获取开关规则**

当对开关变更的延迟有更高的要求时，可以通过实现长连接更新方式来进行优化。下面是实现步骤：

- 首先需要实现异步轮询机制，以便作为长连接更新的备选方案。

- 需要引入 [socket-io](https://github.com/socketio) 客户端依赖到您的 SDK 中，并在 SDK 初始化时与 FeatureProbe Server 建立长连接。您可以在建立连接时发送一个 “register” 事件，并携带一个名为 key, 值为`sdk_key`的参数，以便在后续的身份验证过程中进行验证。其中`sdk_key`是客户端应用程序传递给 FeatureProbe 配置的 Server SDK 密钥。

- 监听名为 “update” 的事件，以便在开关配置发生更改时立即通知客户端主动通过轮询API拉取最新开关规则。

- 最后需要将长连接的地址（realtimeUri）通过 FPConfig 暴露给用户，以方便自定义配置。

***可供参考的代码[长链接 Java 实现](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/server/StreamingSynchronizer.java)***

### 客户端SDK接收开关变更

当我们通过 FeatureProbe 平台或者 Open API 对开关的配置做出变更, 客户端SDK 需要更新内存中的开关对应的结果。目前需提供如下两种实现：

 1、**通过异步轮询获取开关配置**
Server 获取开关结果API协议：
```shell
curl --location --request GET 'https://featureprobe.io/server/api/client-sdk/toggles?user=eyJrZXkiOiIxNjc4MjYyODkzODk2IiwiYXR0cnMiOnt9fQ%3D%3D' \
--header 'Authorization: client-48e0f6f34baef833e1e10df90615b957b1739fb5' 
```
响应协议示例:
```json
{
    "toggle_key": {
        "value": false,
        "ruleIndex": null,
        "trackAccessEvents": true,
        "lastModified": 1676879703000,
        "variationIndex": 0,
        "version": 91,
        "reason": "disabled"
    }
}
```

- 该 API 需要使用 HTTP 请求头将 Authorization 设置为 `sdk_key`，以便在轮询 API 时进行身份验证。其中 `sdk_key` 是客户端应用程序传递给  FeatureProbe 配置的 Client SDK 密钥。

- 还需要使用 HTTP 请求参数将 user 设置为 `FPUser`，参数值为将 FPUser 对象Json序列化后进行Base64编码的字符串。

- 实现异步轮询机制，可以使用定时器或轮询库来定期发送 HTTP 请求以获取最新的开关规则，建议默认频率为5s。
    
- 将轮询 API 的请求地址（synchronizerUrl）和轮询频率（refreshInterval）作为配置项通过FPConfig提供给用户，使得用户可以自定义轮询频率和请求地址。

***可供参考的代码[异步轮询 Javascript 实现](https://github.com/FeatureProbe/client-sdk-js/blob/main/src/FeatureProbe.ts#)中的fetchToggles()方法***


2、**通过长链接获取开关变更事件然后主动触发轮询API**

当对开关变更的延迟有更高的要求时，可以通过实现长连接更新方式来进行优化。下面是实现步骤：

- 首先需要实现异步轮询机制，以便作为长连接更新的备选方案。

- 需要引入[socket.io-client](https://github.com/socketio/socket.io-client)客户端依赖到您的SDK中，并在 SDK 初始化时与 FeatureProbe Server 建立长连接。您可以在建立连接时发送一个 “register” 事件，并携带一个名为 key 值为 `sdk_key` 的参数，以便在后续的身份验证过程中进行验证。其中 `sdk_key` 是客户端应用程序传递给 FeatureProbe 配置的 Client SDK 密钥。

- 监听名为 “update” 的事件，以便在开关配置发生更改时立即通知客户端主动通过轮询API拉取最新开关规则。

- 最后需要将长连接的地址（realtimeUrl）通过 FPConfig 暴露给用户，以方便自定义配置。

***可供参考的代码[长链接Javascript实现 ](https://github.com/FeatureProbe/client-sdk-js/blob/main/src/FeatureProbe.ts#)中的connectSocket()方法***

## 评估开关的结果

服务端SDK和客户端SDK 在开关结果评估的方式上不一致。

### 服务端SDK评估开关结果

服务端SDK 需要在本地内存实现对开关的规则计算，具体计算方法请阅读[开关规则评估](./evaluation-rules)

### 客户端SDK评估开关结果

客户端SDK不用实现开关规则计算的逻辑，由 FeatureProbe 服务负责开关规则计算。所以对于客户端SDK 在实现上只需获取开关的结果。

## 上报事件

目前 FeatureProbe 提供4事件类型的上报：

- **custom**: 当应用程序调用 SDK 的 track 方法时发送的事件。
- **access**: 开关评估事件。
- **pageview**: 对于Javascript SDK或React SDK端记录页面访问事件。
- **click**: 对于Javascript SDK或React SDK端记录页面点击事件。

以及需要上报一段时间内开关各分组访问统计。

所有的 SDK 必须以异步的方式将一段时间内的事件批量发送给 FeatureProbe 服务器。SDK 需启用一个定时任务，默认每隔 5 秒执行一次，将这段时间内产生的事件一并发送给服务器。

上报事件 API 协议

```shell
curl --location --request POST 'https://featureprobe.io/server/api/events' \
--header 'Authorization: client-48e0f6f34baef833e1e10df90615b957b1739fb5' \
--header 'user-agent: Java/1.0.1' \
--header 'Content-Type: application/json' \
--data-raw '[
    {
        "events": [
            {
                "kind": "access",
                "time": 1678343903181,
                "user": "657974429285298",
                "key": "Event_Analysis",
                "value": "4",
                "version": 8,
                "variationIndex": 3,
                "ruleIndex": null,
                "reason": "Default rule hit. "
            },
            {
                "kind": "custom",
                "time": 1678343903181,
                "user": "657974429285298",
                "name": "multi_feature",
                "value": 95.52936252176978
            }
        ],
        "access": {
            "counters": {
                "Event_Analysis": [
                    {
                        "count": 2,
                        "value": "4",
                        "version": 8,
                        "index": 3
                    },
                    {
                        "count": 1,
                        "value": "2",
                        "version": 8,
                        "index": 1
                    },
                    {
                        "count": 3,
                        "value": "1",
                        "version": 8,
                        "index": 0
                    },
                    {
                        "count": 4,
                        "value": "3",
                        "version": 8,
                        "index": 2
                    }
                ]
            },
            "startTime": 1678343903181,
            "endTime": 1678343907896
        }
    }
]'
```

此 API 必须包含以下请求头：

***Authorization***：值为 `sdk_key`，其中 `sdk_key` 是客户端应用程序传递给 FeatureProbe 配置的 Server(Client) SDK 密钥。

***UA***：值为 `sdk_language_kind/sdk_version`，其中 `sdk_language_kind` 是 SDK 实现的语言名称，`sdk_version` 是当前 SDK 的版本号。

## 参考资料

 - 可供参考的服务端SDK 实现: [Java SDK](https://github.com/FeatureProbe/server-sdk-java) 和 [接口文档](https://featureprobe.github.io/server-sdk-java/)
 - 可供参考的客户端SDK 实现: [Javascript SDK](https://github.com/FeatureProbe/client-sdk-js) 和 [接口文档](https://featureprobe.github.io/client-sdk-js/)
