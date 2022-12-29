---
sidebar_position: 2
---

# Android SDK

## Kotlin

### Step 1. Install SDK

```shel
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

### Step 4. Unit Testing (Optional)

```kotlin
val fp_for_test = FeatureProbe.newForTest("{ \"toggle_1\": true }")
val is_true = fp_for_test.boolValue("toggle_1", false)
assert(is_true == true)
```

Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/)
