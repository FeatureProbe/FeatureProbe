---
sidebar_position: 3
---

# iOS SDK

:::note SDK quick links
In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| GitHub repository | [Client Side SDK for iOS](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/sdk-ios) |
| Sample applications      | [demo-cocoapods](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/demo-cocoapods)、[demo-objc](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/demo-objc)、[demo-swiftpm](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/demo-swiftpm) |
| Published module    | [CocoaPods](https://cocoapods.org/pods/FeatureProbe)         |

:::

## Swift

### Step 1. Install SDK

Swift Package Manager:

    1. XCode -> File -> Add Packages -> input `https://github.com/FeatureProbe/client-sdk-ios.git`
    2. click `Add Package`

Cocoapods:

    1. add `pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'` to Podfile
    2. `pod install` or `pod update`

### Step 2. Create a FeatureProbe instance

```swift
import featureprobe


let url = FpUrlBuilder(remoteUrl: "https://featureprobe.io/server").build();
let user = FpUser()
user.setAttr(key: "name", value: "bob")
let config = FpConfig(
    remoteUrl: url!,
    clientSdkKey: "client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d",
    refreshInterval: 10,
    waitFirstResp: true
)
let fp = FeatureProbe(config: config, user: user)
```

### Step 3. Use the feature toggle

```swift
let showFeature = fp.boolValue("toggle_key", false)
if showFeature {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}
```

### Step 4. Track Events

:::note
The Swift SDK supports event tracking from version 2.0.2.
:::


The event tracking feature can record the actions taken by the user in the application as events.

Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).

```swift
fp.track(event: "YOUR_CUSTOM_EVENT_NAME")
// Providing a metric value to track
fp.track(event: "YOUR_CUSTOM_EVENT_NAME", value: 5.5)
```


### Step 5. Unit Testing (Optional)

```swift
let fp = FeatureProbe.newForTest(toggles: "{ \"toggle_1\": true }")
let is_true = fp.boolValue(key: "toggle_1", defaultValue: false)
assert(is_true == true);
```

Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/)

## Objective-C

### Step 1. Install SDK

Cocoapods

add `pod 'FeatureProbe', :git => 'git@github.com:FeatureProbe/client-sdk-ios.git'` to Podfile

`pod install` or `pod update`

### Step 2. Create a FeatureProbe instance

```objective-c
#import "FeatureProbe-Swift.h"

NSString *urlStr = @"https://featureprobe.io/server";
FpUrl *url = [[[FpUrlBuilder alloc] initWithRemoteUrl: urlStr] build];
FpUser *user = [[FpUser alloc] init];
[user setAttrWithKey:@"name" value:@"bob"];
FpConfig *config = [[FpConfig alloc] initWithRemoteUrl: url
                                          clientSdkKey:@"client-9d885a68ca2955dfb3a7c95435c0c4faad70b50d"
                                       refreshInterval: 10
                                         waitFirstResp: true];
FeatureProbe *fp = [[FeatureProbe alloc] initWithConfig:config user:user];
```

### Step 3. Use the feature toggle

```objective-c
bool showFeature = [fp boolValueWithKey: @"toggle_key" defaultValue: false];
if (showFeature) {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}
```

### Step 4. Track Events

:::note
The Objc SDK supports event tracking from version 2.0.2.
:::


The event tracking feature can record the actions taken by the user in the application as events.

Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).

```objective-c
[fp trackWithEvent:@"YOUR_CUSTOM_EVENT_NAME"];
// Providing a metric value to track
[fp trackWithEvent:@"YOUR_CUSTOM_EVENT_NAME" value:5.5];
 
```

### Step 5. Unit Testing (Optional)

```objective-c
#import "FeatureProbe-Swift.h"

NSString *s = @"{ \"ab_test\": \"green\"}";
FeatureProbe *fp = [[FeatureProbe alloc] initWithTestJson: s];
NSString *value = [fp stringValueWithKey:@"ab_test" defaultValue:@"red"];
NSLog(@"value is %@", value);
```

Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-mobile/tree/main/examples/)
