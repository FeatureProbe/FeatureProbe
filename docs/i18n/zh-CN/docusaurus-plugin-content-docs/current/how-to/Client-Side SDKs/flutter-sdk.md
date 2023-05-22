---
sidebar_position: 6
---

# Flutter SDK

:::note SDK quick links

除了本参考指南外，我们还提供源代码、示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| GitHub repository | [Client Side SDK for Flutter](https://github.com/FeatureProbe/client-sdk-flutter) |
| Sample applications  | [Demo code](https://github.com/FeatureProbe/client-sdk-flutter/tree/main/example) (Flutter)|

:::

## Flutter

### Step 1. 安装 SDK

```yaml
dependencies:
    featureprobe:
      git:
        url: https://github.com/FeatureProbe/client-sdk-flutter.git
```

### Step 2.  创建一个 FeatureProbe instance

```dart
import 'package:featureprobe/featureprobe.dart';

var fpUser = FPUser();
fp = FeatureProbe(
    "https://featureprobe.io/server",
    "client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d", // change to your sdk key
    fpUser,
    10 * 1000,
    2 * 1000);
await fp.start();
```

### Step 3.  使用 FeatureProbe 开关

``` dart
bool showFeature = fp.boolValue("toggle_key", false);
if (showFeature) {
    // application code to show the feature
} else {
    // the code to run if the feature is off
}
```

### Step 4. 事件上报

事件跟踪功能可以将用户在应用程序中采取的操作记录为事件。
可以在开关的指标中关联事件。更多指标分析相关的信息，请阅读[指标分析](../../tutorials/analysis)。

```dart
fp.track("YOUR_CUSTOM_EVENT_NAME");
// Providing a metric value to track
fp.track("YOUR_CUSTOM_EVENT_NAME", 5.5);
```
