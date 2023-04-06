---
sidebar_position: 1
---

# JavaScript SDK

FeatureProbe is an open source feature management service. This SDK is used to control features in JavaScript programs.

:::tip Notice
For users who needs to use metric analysis, please upgrade JavaScript SDK to version [ 2.0.1 ](https://www.npmjs.com/package/featureprobe-client-sdk-js/v/2.0.1). From this version, we support sending click, page view, and custom events.
:::

:::note SDK quick links
In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API documentation  | [ SDK API docs](https://featureprobe.github.io/client-sdk-js/) |
| GitHub repository | [Client Side SDK for JavaScript](https://github.com/FeatureProbe/client-sdk-js) |
| Sample applications      | [Demo code](https://github.com/FeatureProbe/client-sdk-js/blob/main/example/index.html) (HTML+JS) |
| Published module    | [npm](https://www.npmjs.com/package/featureprobe-client-sdk-js) |

:::

## Try Out Demo Code

We provide a runnable demo code for you to understand how FeatureProbe SDK is used.

1. First, you need to choose which environment FeatureProbe is connected to control your program
     * You can use our online [demo environment](https://featureprobe.io/login)
     * You can also use your own [docker environment](https://github.com/featureprobe/FeatureProbe)

2. Download this repo and run the demo program:

```bash
git clone https://github.com/FeatureProbe/client-sdk-js.git
cd client-sdk-js
```

3. Modify the link information in the `example/index.html` program.
     * For online demo environment:
         * `remoteUrl` = "https://featureprobe.io/server"
         * `clientSdkKey` Please copy from the following interface:

       ![client_sdk_key snapshot](/client_sdk_key_snapshot_cn.png)
     * For local docker environment:
         * `remoteUrl` = "http://YOUR_DOCKER_IP:4009/server"
         * `clientSdkKey` = "client-25614c7e03e9cb49c0e96357b797b1e47e7f2dff"

4. Run the program.

```
// open example/index.html in browser
```

## Step-by-Step Guide

In this guide we explain how to use feature toggles in a JavaScript application using FeatureProbe.

### Step 1. Install the JavaScript SDK

First, install the FeatureProbe SDK as a dependency in your application.

NPM:

```js
npm install featureprobe-client-sdk-js --save
```

Or via CDN:

```js
<script type="text/javascript" src="https://unpkg.com/featureprobe-client-sdk-js@latest/dist/featureprobe-client-sdk-js.min.js"></script>
```

### Step 2. Create a FeatureProbe instance

After you install and import the SDK, create a single, shared instance of the FeatureProbe sdk.

NPM:

```js
const user = new FPUser();
user.with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);

const fp = new FeatureProbe({
  remoteUrl: /* FeatureProbe Server URI */,
  clientSdkKey: /* clientSdkKey */,
  user,
});

fp.start();
```

Or via CDN:

```js
const user = new featureProbe.FPUser();
user.with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);

const fp = new featureProbe.FeatureProbe({
    remoteUrl: /* FeatureProbe Server URI */,
    clientSdkKey: /* clientSdkKey */,
    user,
});

fp.start();
```

### Step 3. Use the instance to get your setting value

You can use sdk to check which value this user will receive for a given feature flag.

```js
fp.on('ready', function() {
    const result = fp.boolValue('YOUR_TOGGLE_KEY', false);
    if (result) {
        do_some_thing();
    } else {
        do_other_thing();
    }
    const reason = fp.boolDetail('YOUR_TOGGLE_KEY', false);
    console.log(reason);
})
```

### Step 4. Unit Testing (Optional)

NPM:

```js
test("feature probe unit testing", (done) => {
  let fp = FeatureProbe.newForTest({ testToggle: true });
  fp.start();

  fp.on("ready", function () {
    let t = fp.boolValue('YOUR_TOGGLE_KEY', false);
    expect(t).toBe(true);
    done();
  });
});
```

Or via CDN:

```js
test("feature probe unit testing", (done) => {
  let fp = featureProbe.FeatureProbe.newForTest({ testToggle: true });
  fp.start();

  fp.on("ready", function () {
    let t = fp.boolValue('YOUR_TOGGLE_KEY', false);
    expect(t).toBe(true);
    done();
  });
});
```

## Track events

:::note
JavaScript SDK supports event tracking from version 2.0.1.
:::

JavaScript SDK supports tracking `custom events`, `pageview events` and `click events`.

The track of `pageview events` and `click events` is done by the SDK itself automatically, you have no need to write any code.

### Track custom events
After the SDK is ready, call the `track` api.


```js
fp.on('ready', function() {
  const result = fp.boolValue('YOUR_TOGGLE_KEY', false);
  if (result) {
    do_some_thing();
  } else {
    do_other_thing();
  }
  const reason = fp.boolDetail('YOUR_TOGGLE_KEY', false);
  console.log(reason);

  // Send a custom event.
  // The first parameter is the event name,
  // the second parameter is optional, it means a metric value to track
  // highlight-start
  fp.track('YOUR_CUSTOM_EVENT_NAME_1');
  fp.track('YOUR_CUSTOM_EVENT_NAME_2', 5.5);
  // highlight-end
})
```

## Available options

This SDK takes the following options:

| option            | required       | default | description                                                                                                                                      |
|-------------------|----------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| remoteUrl         | depends | n/a     | The unified URL to get toggles and post events |
| togglesUrl        | no             | n/a     | The specific URL to get toggles, once set, remoteUrl will be ignored |
| eventsUrl         | no             | n/a     | The specific URL to post events, once set, remoteUrl will be ignored |
| clientSdkKey      | yes            | n/a     | The Client SDK Key is used to authentification   |
| user              | yes            | n/a     | The User with attributes like name, age is used when toggle evaluation |
| refreshInterval   | no            | 1000    | The SDK check for updated in millisecond   |
| timeoutInterval   | no            | 10000    | Timeout for SDK initialization, SDK will emit an `error` event when timeout is reaching  |


## SDK Events

- **ready** - Emit `ready` event after successfully fetching toggles from `Server`
- **cache_ready** - Emit `cache_ready` event after successfully fetching toggles from `LocalStorage`
- **error** - Emit `error` event when error fetching toggles from `Server` and timeout exceeded
- **update** - Emit `update` event every time successfully fetching toggles from `Server`, except for the first time (Emit `ready` event first time)
- **fetch_toggle_error** - Emit `fetch_toggle_error` event every time error fetching toggles from `Server`
- **fetch_event_error** - Emit `fetch_event_error` event when error fetching events(Custom events, Pageview events and Click events) from `Server` during SDK initialization

## Testing

```js
npm run test
```
