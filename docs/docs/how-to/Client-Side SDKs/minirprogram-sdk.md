---
sidebar_position: 4
---

# MiniProgram SDK

:::tip
This SDK is only applicable to WeChat mini program, other mini programs including Alipay, Baidu, DingDing and TouTiao are preparing, will be released soon. To provide a better integration for use in mini program applications, MiniProgram SDK builds on JavaScript SDK. Much of the JavaScript SDK functionality is also available for the MiniProgram SDK to use. Please reference [JavaScript SDK](./javascript-sdk.md).
:::

:::tip Notice
For users who needs to use metric analysis, please upgrade MiniProgram SDK to version [ 2.0.1 ](https://www.npmjs.com/package/featureprobe-client-sdk-miniprogram/v/2.0.1). From this version, we support sending custom events.
:::

:::note SDK quick links
In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API documentation  | [ SDK API docs](https://featureprobe.github.io/client-sdk-miniprogram/) |
| GitHub repository | [Client Side SDK for MiniProgram](https://github.com/FeatureProbe/client-sdk-miniprogram) |
| Sample applications    | [Demo code](https://github.com/FeatureProbe/client-sdk-miniprogram/tree/main/example) |
| Published module    | [npm](https://www.npmjs.com/package/featureprobe-client-sdk-miniprogram) |

:::

## Try Out Demo Code

We provide a runnable demo code for you to understand how FeatureProbe SDK is used.

1. First, you need to choose which environment FeatureProbe is connected to control your program
     * You can use our online [demo environment](https://featureprobe.io/login)
     * You can also use your own [docker environment](https://github.com/featureprobe/FeatureProbe)

2. Download this repo and run the demo program:

```bash
git clone https://github.com/FeatureProbe/client-sdk-miniprogram.git
cd client-sdk-miniprogram
```

3. Modify the link information in the [example](https://github.com/FeatureProbe/client-sdk-miniprogram/tree/main/example).
     * For online demo environment:
         * `remoteUrl` = "https://featureprobe.io/server"
         * `clientSdkKey` Please copy from the following interface:

       ![client_sdk_key snapshot](/client_sdk_key_snapshot_cn.png)
     * For local docker environment:
         * `remoteUrl` = "http://YOUR_DOCKER_IP:4009/server"
         * `clientSdkKey` = "client-25614c7e03e9cb49c0e96357b797b1e47e7f2dff"

4. Run the program.

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

## Track events

:::note
Mini Program SDK supports event tracking from version 2.0.1.
:::

### Track custom events
After the SDK is ready, call the `track` api.


```js
featureProbeClient.on('ready', function() {
  // Send a custom event.
  // The first parameter is the event name,
  // the second parameter is optional, it means a metric value to track
  // highlight-start
  featureProbeClient.track('YOUR_CUSTOM_EVENT_NAME_1');
  featureProbeClient.track('YOUR_CUSTOM_EVENT_NAME_2', 5.5);
  // highlight-end
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
| timeoutInterval   | no            | 10000    | Timeout for SDK initialization, SDK will emit an `error` event when timeout is reaching  |
