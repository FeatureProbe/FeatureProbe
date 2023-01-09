---
sidebar_position: 3
---

# SDK implementation principle

This document mainly introduces the implementation principle of FeatureProbe SDK.

:::tip
The FeatureProbe SDK is divided into two types: Client-side SDK and Server-side SDK. For related concepts, please refer to the [SDK Basic Concepts](/reference/sdk-introduction) document.
:::


## Implementation principle

### Server-side SDK

![image-20221028095725775](/server_side_sdk.png)

As shown in the figure above, the Server-Side SDK is mainly used in the back-end services of the business system, and the core implementation mainly includes the following parts:

#### 1. Initialization

Initialize a FeatureProbe Client instance. Take the Java code as an example. After the `FeatureProbe` instance is created, it means that the initialization is completed.

```java
FPConfig config = FPConfig.builder().remoteUri(/* FeatureProbe Server URI */)
         .build();
// initialization
FeatureProbe fpClient = new FeatureProbe(/* FeatureProbe Server SDK Key */, config);
```

The working principle of the initialization is that the SDK pulls all toggles/segments [Rules](https://github.com/FeatureProbe/server-sdk-specification/blob/065c758e62b057e8f0664f9d2561fa1d35200306/spec/toggle_simple_spec.json) under the specified `serverSdkKey` from the server (FeatureProbe Server) via HTTP , and stored inside the SDK.

For businesses that strongly depend on the toggle results, the SDK needs to ensure that the pull of toggle data from the server is as successful as possible during initialization, so we added a `StartWait` waiting mechanism during initialization. When initialization fails (such as network timeout), initialization will be performed retry until the initialization succeeds or the `StartWait` time elapses. At the same time, the SDK provides the `fpClient.initialized()` function to obtain the initial initialization result.


### 2. Get the toggle result

The SDK provides corresponding functions for the return value types of different toggles to calculate the toggle results:

```java
boolean boolValue = fpClient. boolValue("YOUR_TOGGLE_KEY", user, false);
String stringValue = fpClient. stringValue("YOUR_TOGGLE_KEY", user, false);
....
```

Since the toggle rules are stored in the SDK during initialization, the calculation of the toggle result rules is only implemented in the SDK without any network interaction. When the business code calls the SDK, the return value will be calculated in real time according to the toggle rules cached in the memory.

#### 3. Synchronous toggle rules

When the toggle changes, the SDK needs to obtain the latest toggle rules to ensure the realizability of the calculation results. Therefore, the SDK internally adopts a polling (**Polling**) mechanism (once every 3 seconds by default) to asynchronously obtain the latest toggle rules from the FeatureProbe server and update them to the cache, and will calculate and return results based on the latest rules each time the toggle results are obtained. We are currently upgrading the polling mechanism to the WebSocket mechanism.

#### 4. Toggle access data reporting

The access data of the SDK can be displayed in real time in the [Data Metrics](/how-to/platform/metrics) function module, so the SDK will collect the currently hit group and toggle version information each time the toggle result is obtained, in order to ensure that it does not affect SDK access performance, the access data collection will be recorded in the local memory first, and then aggregated and reported to the FeatureProbe Server at regular intervals (every 3 seconds by default).


### Client-side SDK

![image-20221028095725775](/client_side_sdk.png)

As shown in the figure above, the Client-Side SDK is mainly aimed at the device environment of users such as mobile apps and browsers. The core implementation mainly includes the following parts:

#### 1. Initialization

Since the Client-side SDK itself does not contain the function of rule calculation, it is necessary to upload various attributes of the represented user to the server during initialization, and the server (FeatureProbe Server) calculates all toggles and returns results for the toggles of the current user, and then return to the Client-side SDK to cache in the App. The following is an example of Android SDK initialization:

```java
val user = FpUser()
user.setAttr("name", "bob") // build user attributes
val config = FpConfig(/* FeatureProbe Server URI */, /* FeatureProbe Server SDK Key */, 10u, true)
val fpClient = FeatureProbe(config, user) // Report user attributes to perform initialization
```

#### 2. Get the toggle result

Since all toggle calculation results have been synchronized and cached in the app during initialization, when the business code obtains the corresponding toggle value, it is the memory cache result obtained directly through the FeatureProbe SDK.

#### 3. Synchronous toggle results

The client-side SDK synchronization method is the same as that of the server-side SDK, both of which use the polling (**Polling**) mechanism to asynchronously synchronize data from the FeatureProbe server. The main difference is that what the Client-side SDK synchronizes is the toggle result. We are currently upgrading the polling mechanism to the WebSocket mechanism.

#### 4. Toggle access data reporting

The implementation mechanism of toggle access data reporting is consistent with that of Server-side SDK.
