---
sidebar_position: 2
---

# SDK Introduction

This document mainly introduces the classification, implementation, similarities and differences of SDKs.

## SDK Implementation

SDK matches the user attributes according to the toggle rules pre-configured in the UI platform of FeatureProbe, and returns the rule value. For example, for a feature in the APP is pre-set in advance to control the opening and closing. After running for a period of time, it is found that a bug will be triggered under certain circumstances, then we can have a rule that is lower than the specified version, and this rule value returns false . Then we need to add the `app_version` attribute to SDK User object, so that when the attribute is passed to the FeatureProbe server, the corresponding rule will return false for the lower version, closing that feature.

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

- FPDetail
  - `value` : the value corresponding to the rule in the UI platform.
  - `rule index`: The sequence number of the rule in the UI configuration that hit the rule.
  - `variation index`: The sequence number of the variations in the UI platform
  - `version`: the version of toggle
  - `reason`: why return this value, like disabled, default, not exist and so on.


## Differences between SDKs

At present, the SDK has two types: Client-side SDK and Server-side SDK.

### Client-side SDK

It is mainly aimed at the device environment of APP users such as browsers and mobile device, including three categories: JavaScript, Android and iOS. Compared with the Server-side SDK, the performance and security level of the device are not as good as the server in the IDC, so the Client-side SDK chooses to hand over the toggle evaluation to the FeatureProbe server, and wait for the server to complete. Subsequent toggle value obtain from the cache in memory.

### Server-side SDK

Currently, it is mainly aimed at back-end services deployed in the developer's IDC or FeatureProbe's IDC, including Golang, Java, Rust, Python, etc. Because the performance of the server is better, the concurrency is larger, the security level is higher, and the attribute of User changes according to the number of users, the calculation of the rules is calculated in real time in the Server-side SDK.

## SDK Key

Client SDK Key can only be used in Client-side SDK, and can only pull calculation results.

Server SDK Key can only be used in Server-side SDK, and can only pull calculation rules and evaluate them in real time in the SDK.

## Privacy

Attributes in User Object are currently not persisted in FeatureProbe.

* The User object of the Server-side SDK is in the developer's own application and will not be sent to the FeatureProbe's server.
* User of Client-side SDK will be sent to FeatureProbe's server, but will not be stored.
