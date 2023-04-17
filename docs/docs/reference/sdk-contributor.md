---
sidebar_position: 4
---

# SDK Contribution Guide

## Overview

This document aims to introduce the workings of the FeatureProbe SDK in order to assist those who wish to create new SDKs for FeatureProbe or contribute to existing ones. All of our SDKs are open-source, and we welcome contributions from members of the community.

## Architecture

All SDKs must include the following components:

 - [Receiving changes to feature flags](#receiving-changes-to-feature-flags)
 - [Evaluating feature flag results](#evaluating-feature-flag-results)
 - [Track events](#track-events)



## Receiving changes to feature flags

The FeatureProbe SDK stores all feature flags in memory. Currently, two different methods are provided to update feature flags: asynchronous polling and streaming api. For SDKs that already support streaming api, streaming api is the default update method. The implementation of asynchronous polling is necessary because the streaming api implementation relies on asynchronous polling as a fallback.

Regarding feature flag storage, server-side SDKs and client-side SDKs have different implementations. Server-side SDKs store feature flag rules directly in memory. On the other hand, client-side SDKs store the evaluated feature flag results due to data security concerns and the relatively stable nature of users.

### Receiving changes to feature flags in server-side SDKs

When we make changes to the configuration of feature flags through the FeatureProbe platform or Open API, server-side SDKs need to update the feature flag rules stored in memory. Currently, the following two implementations need to be provided:

 1、**Getting feature flag rules through asynchronous polling**

Protocol for the API used by the server to retrieve feature flag configurations：
```shell
curl --location --request GET 'https://featureprobe.io/server/api/server-sdk/toggles' \
--header 'Authorization: server-9e53c5db4fd75049a69df8881f3bc90edd58fb06'   
```
Example response protocol:
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

- This API requires setting the Authorization HTTP request header to `sdk_key` to authenticate when polling the API. `sdk_key` is the Server SDK key passed by the client application to FeatureProbe configuration.

- To implement asynchronous polling, a timer or polling library can be used to periodically send HTTP requests to retrieve the latest feature flag rules. The recommended default frequency is 5 seconds.
    
- The request address for the polling API (synchronizerUrl) and polling frequency (refreshInterval) should be provided to users as configuration options through FPConfig, so that users can customize the polling frequency and request address.

***Reference [Java code for implementing asynchronous polling](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/server/PollingSynchronizer.java)***

 2、**Retrieve feature flags change events through streaming api**

When there is a higher requirement for the latency of feature flags changes, optimization can be achieved by implementing the streaming api update method. The following are the implementation steps:

- First, it is necessary to implement the asynchronous polling mechanism as an alternative solution for streaming api updates.

- To implement the streaming api mechanism, you will need to add the [socket.io-client](https://github.com/socketio/socket.io-client) client dependency to your SDK and establish a long connection with the FeatureProbe Server during SDK initialization. You can send a "register" event with a parameter named key and a value of `sdk_key` to verify the SDK's identity during the authentication process. Here, `sdk_key` is the Server SDK key passed by the client application to the FeatureProbe configuration.

- Listen to the "update" event so that when the feature flags configuration changes, the client is immediately notified to proactively pull the latest switch rule through the polling API.

- Finally, the address of the streaming api (realtimeUri) needs to be exposed to users through FPConfig to facilitate custom configuration.

***Reference [Java code for implementing streaming api](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/server/StreamingSynchronizer.java)***

### Client SDK receives feature flags change

When we make changes to the feature flags configuration through the FeatureProbe platform or Open API, the client SDK needs to update the results of the corresponding  feature flags in memory. Currently, the following two implementations need to be provided:

 1、**Getting feature flag result through asynchronous polling**
Protocol for the API used by the server to retrieve feature flag result:
```shell
curl --location --request GET 'https://featureprobe.io/server/api/client-sdk/toggles?user=eyJrZXkiOiIxNjc4MjYyODkzODk2IiwiYXR0cnMiOnt9fQ%3D%3D' \
--header 'Authorization: client-48e0f6f34baef833e1e10df90615b957b1739fb5' 
```
Example response protocol:
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

- This API requires setting the Authorization HTTP request header to `sdk_key` for authentication during polling API. `sdk_key` is the Client SDK key passed by the client application to FeatureProbe configuration.

- Additionally, the API requires setting the user parameter in the HTTP request as `FPUser`, with its value being the Base64-encoded string obtained from serializing the FPUser object to a JSON format.

- To implement the asynchronous polling mechanism, you can use a timer or a polling library to periodically send HTTP requests to obtain the latest feature flags result. It is recommended to set the default frequency to 5 seconds.
    
- Make the polling API's request address (synchronizerUrl) and polling frequency (refreshInterval) available as configuration options through FPConfig, so that users can customize the polling frequency and request address.

***Reference [Javascript code for implementing asynchronous polling](https://github.com/FeatureProbe/client-sdk-js/blob/main/src/FeatureProbe.ts#) fetchToggles() method***


2、**Retrieve feature flags change events through streaming api**

Here are the steps to implement streaming api for updating feature flag changes with high latency requirements:

- First, implement asynchronous polling mechanism as an alternative solution for streaming api updates

- To implement the streaming api mechanism, you will need to add the [socket.io-client](https://github.com/socketio/socket.io-client) client dependency to your SDK and establish a long connection with the FeatureProbe Server during SDK initialization. You can send a "register" event with a parameter named key and a value of `sdk_key` to verify the SDK's identity during the authentication process. Here, `sdk_key` is the Server SDK key passed by the client application to the FeatureProbe configuration.

- Listen to the "update" event so that when the feature flags configuration changes, the client is immediately notified to proactively pull the latest switch rule through the polling API.

- Finally, the address of the streaming api (realtimeUri) needs to be exposed to users through FPConfig to facilitate custom configuration.

***Reference [Javascript code for implementing streaming api](https://github.com/FeatureProbe/client-sdk-js/blob/main/src/FeatureProbe.ts#) connectSocket() method***

## Evaluating feature flag results

When the server-side and client-side SDKs have inconsistencies in the way they evaluate feature flag results.

### Evaluating feature flag results for server-side SDK

The server-side SDK needs to implement rule evaluation for feature flag in local memory. For specific calculation methods, please refer to the [Feature Flag Rule Evaluation](./evaluation-rules).

### Evaluating feature flag results for client-side SDK

The client-side SDK does not need to implement the logic of feature flag rule calculation, which is the responsibility of the FeatureProbe service. Therefore, for the client-side SDK, the implementation of obtaining feature flag results described above can be simplified.

## Track events

Currently, FeatureProbe provides 4 types of events for reporting:

- **custom**: Events sent when the application calls the SDK's track method.
- **access**: Feature flag evaluation information。
- **pageview**: Records page access events for the JavaScript SDK.
- **click**: Records page click events for the JavaScript SDK.

And it is necessary to report the access statistics of each group's feature flag within a certain period of time.

All SDKs must send events in batches to the FeatureProbe server asynchronously for a period of time. The SDKs need to enable a timer task, which is executed every 5 seconds by default, to send all events generated during this period to the server.

Protocol for the track events
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

This API must include the following request headers:

***Authorization***：The value is `sdk_key`, where `sdk_key` is the Server(Client) SDK key passed by the client application to FeatureProbe configuration.

***UA***：The value is `sdk_language_kind/sdk_version`, where `sdk_language_kind` is the language name of the SDK implementation, and `sdk_version` is the version number of the current SDK.

## Reference Materials.

 - Reference implementation of the server-side SDK: [Java SDK](https://github.com/FeatureProbe/server-sdk-java) and [API Docs](https://featureprobe.github.io/server-sdk-java/)
 - Reference implementation of the client-side SDK: [Javascript SDK](https://github.com/FeatureProbe/client-sdk-js) and [API Docs](https://featureprobe.github.io/client-sdk-js/)
