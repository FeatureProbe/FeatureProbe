---
sidebar_position: 2
---

# Android SDK

:::note SDK quick links

In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| GitHub repository | [Client Side SDK for Android](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/sdk-android) |
| Sample applications      | [Demo code](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/demo-android) (Kotlin) |
| Published module    | [maven](https://mvnrepository.com/artifact/com.featureprobe/client-sdk-android) |

:::

## Kotlin

### Step 1. Install SDK

```shell
implementation 'com.featureprobe:client-sdk-android:1.2.0@aar'
implementation 'net.java.dev.jna:jna:5.7.0@aar'
```

### Step 2. Create a FeatureProbe instance

```kotlin
import com.featureprobe.mobile.*;

val url = FpUrlBuilder("https://featureprobe.io/server").build();
val user = FpUser()
user.setAttr("name", "bob")
val config = FpConfig(url!!, "client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d", 10u, true)
val fp = FeatureProbe(config, user)
```

### Step 3.  Use the feature toggle

``` kotlin
val showFeature = fp.boolValue("toggle_key", false)
if (showFeature) {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}
```

### Step 4. Track Events

:::note
The Kotlin SDK supports event tracking from version 2.0.2.
:::


The event tracking feature can record the actions taken by the user in the application as events.

Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).

```kotlin
fp.track("YOUR_CUSTOM_EVENT_NAME")
// Providing a metric value to track
fp.track("YOUR_CUSTOM_EVENT_NAME", 5.5)
```

### Step 5. Unit Testing (Optional)

```kotlin
val fp_for_test = FeatureProbe.newForTest("{ \"toggle_1\": true }")
val is_true = fp_for_test.boolValue("toggle_1", false)
assert(is_true == true)
```

Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/)
