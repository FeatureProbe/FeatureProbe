---
sidebar_position: 2
---

# Android SDK

:::note SDK quick links
除了本参考指南外，我们还提供源代码、示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| GitHub 代码库 | [Client Side SDK for Android](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/sdk-android) |
| 接入示例      | [Demo code](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/demo-android) (Kotlin) |
| 已发布模块    | [maven](https://mvnrepository.com/artifact/com.featureprobe/client-sdk-android) |

:::

## Kotlin

### 步骤 1. 安装 SDK

```shell
implementation 'com.featureprobe:client-sdk-android:1.2.0@aar'
implementation 'net.java.dev.jna:jna:5.7.0@aar'
```

### 步骤 2. 创建一个 FeatureProbe instance

```kotlin
import com.featureprobe.mobile.*;

val url = FpUrlBuilder("https://featureprobe.io/server").build();
val user = FpUser()
user.setAttr("name", "bob")
val config = FpConfig(url!!, "client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d", 10u, true)
val fp = FeatureProbe(config, user)
```

### 步骤 3.  使用 FeatureProbe 开关

``` kotlin
val showFeature = fp.boolValue("toggle_key", false)
if (showFeature) {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}
```

### 步骤 4. 单元测试 (可选)

```kotlin
val fp_for_test = FeatureProbe.newForTest("{ \"toggle_1\": true }")
val is_true = fp_for_test.boolValue("toggle_1", false)
assert(is_true == true)
```

Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/)
