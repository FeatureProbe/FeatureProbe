---
sidebar_position: 2
---

# SDK Introduction

This document mainly introduces the classification, implementation, similarities and differences of SDKs.

## SDK Implementation

SDK matches the user attributes according to the toggle rules pre-configured in the UI platform of FeatureProbe, and returns the rule value. 

## Differences between SDKs

At present, the SDK has two types: Client-side SDK and Server-side SDK.

### Client-side SDK

It is mainly aimed at the device environment of APP users such as browsers and mobile device, including three categories: JavaScript, Android and iOS. Compared with the Server-side SDK.

* Generally, the Client SDK has a one-to-one relationship with the user, and the Client SDK always represents the result of the same user requesting the toggle.
* The performance and security level of the equipment is not as good as the server in the IDC

### Server-side SDK

It is mainly used in the back-end services of business systems, and supports Golang, Java, Rust, Python, Node.js and other languages. Has the following characteristics:

* The backend service of the business system usually handles a large number of user requests, and needs to request the FeatureProbe SDK on behalf of different users to get the toggle results of each user.
* The server has high performance and can undertake part of the computing tasks

:::tip
To learn more about the difference between Client-side SDK and Server-side SDK, you can view the [SDK Specification](/reference/sdk-specification) document.
:::

## SDK Key

Client SDK Key can only be used in Client-side SDK, and can only pull calculation results.

Server SDK Key can only be used in Server-side SDK, and can only pull calculation rules and evaluate them in real time in the SDK.

## Core Data Structure

- FPConfig
  - `remote url`: url to connect featureprobe service.
  - `sdk key`: server sdk and client sdk, which are used to pull toggle information, which can be found in the project list of the UI platform.
  - `refresh interval`: interval for fetch toggle information and for report toggle access information.
  - `wait first response`: whether to wait for the toggle to be fetched, if not, the toggle evaluation at startup will get the default value.

- FPUser
  - `new` function: the unique identifier of the user in your business, which is used to distinguish different users.
  - `with` function: used to upload attributes, you can select properties (like city, country) in rules to return different values in UI platform.

- FeatureProbe
  - `value` functions: there are bool/string/number/json four types. used to get the value corresponding to the rule in the UI platform, the  type correspond to the type of toggle in UI platform.
  - `detail` functions: there are bool/string/number/json four types. used to get the value corresponding to the rule in the UI platform, and more debug info.
  - `close` method: Close the FeatureProbe client gracefully to ensure that all metrics information is uploaded.

- FPDetail
  - `value` : the value corresponding to the rule in the UI platform.
  - `rule index`: The sequence number of the rule in the UI configuration that hit the rule.
  - `variation index`: The sequence number of the variations in the UI platform
  - `version`: the version of toggle
  - `reason`: why return this value, like disabled, default, not exist and so on.

## Privacy

Attributes in User Object are currently not persisted in FeatureProbe.

* The User object of the Server-side SDK is in the developer's own application and will not be sent to the FeatureProbe's server.
* User of Client-side SDK will be sent to FeatureProbe's server, but will not be stored.
