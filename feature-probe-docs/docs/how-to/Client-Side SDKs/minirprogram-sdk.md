---
sidebar_position: 4
---

# MiniProgram SDK

:::tip
This SDK is only applicable to WeChat mini program, other mini programs including Alipay, Baidu, DingDing and TouTiao are preparing, will be released soon.
:::

## Try Out Demo Code

We provide a runnable demo code for you to understand how FeatureProbe SDK is used.

1. Start FeatureProbe Service with docker composer. [How to](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. Download this repo and run the demo program:

```bash
git clone https://github.com/FeatureProbe/client-sdk-miniprogram.git
cd client-sdk-miniprogram
```

3. Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-miniprogram/tree/main/example),
do some change and run the program again.

<!-- ```
// open example/index.html in browser
``` -->

## Step-by-Step Guide

In this guide we explain how to use feature toggles in a Wechat MiniProgram application using FeatureProbe.

### Step 1. Install MiniProgram SDK

Install the FeatureProbe SDK as a dependency in your application.


```js
npm install featureprobe-client-sdk-miniprogram --save
```


### Step 2. Initialize SDK client
Initialize SDK client with required options


```js
import { initialize, FPUser } from 'featureprobe-client-sdk-miniprogram';

const user = new FPUser();
user.with("userId", /* userId */);

const featureProbeClient = initialize({
  remoteUrl: "https://featureprobe.io/server",
  // remoteUrl: "https://127.0.0.1:4007", // for local docker
  clientSdkKey: /* clientSdkKey */
  user,
});

featureProbeClient.start();
```


### Step 3. Get varation value 

You can get variation value from globalData object, SDK will update `globalData.toggles` object automatically

```js
const app = getApp();   // getApp is a global function provided Wechat Miniprogram

const value = app.globalData.toggles[/* toggleKey */].value;
const reason = app.globalData.toggles[/* toggleKey */].reason;
```

You can also use the SDK API to get value or detail.

```js
featureProbeClient.on("ready", function() {
  const result = featureProbeClient.boolValue(/* toggleKey */, false);
  if (result) {
    do_some_thing();
  } else {
    do_other_thing();
  }
  const reason = featureProbeClient.boolDetail(/* toggleKey */, false);
  console.log(reason);
})
```

## Available options for initialization

This SDK takes the following options:

| option            | required       | default | description                                                                                                                                      |
|-------------------|----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| remoteUrl         | depends | n/a     | The unified URL to get toggles and post events |
| togglesUrl        | no             | n/a     | The specific URL to get toggles, once set, remoteUrl will be ignored |
| eventsUrl         | no             | n/a     | The specific URL to post events, once set, remoteUrl will be ignored |
| clientSdkKey      | yes            | n/a     | The Client SDK Key is used to authentification   |
| user              | yes            | n/a     | The User with attributes like name, age is used when toggle evaluation |
| refreshInterval   | no            | 1000     | The SDK check for updated in millisecond   |
| timeoutInterval   | no            | 1000    | Timeout for SDK initialization, SDK will emit an `error` event when timeout is reaching  |


## SDK Open API

API Docs: [SDK API](https://featureprobe.github.io/client-sdk-js/)

## SDK Events

- **ready** - Emit `ready` event after successfully fetching toggles from `Server`
- **cache_ready** - Emit `cache_ready` event after successfully fetching toggles from `LocalStorage`
- **error** - Emit `error` event when error fetching toggles from `Server` and timeout exceeded
- **update** - Emit `update` event every time successfully fetching toggles from `Server`, except for the first time (Emit `ready` event first time)

## Testing

```shell
npm run test
```
