---
sidebar_position: 1
---

# JavaScript SDK

## Try Out Demo Code

We provide a runnable demo code for you to understand how FeatureProbe SDK is used.

1. Start FeatureProbe Service with docker composer. [How to](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. Download this repo and run the demo program:

```bash
git clone https://github.com/FeatureProbe/client-sdk-js.git
cd client-sdk-js
// open example/index.html in browser
```

3. Find the Demo code in [example](https://github.com/FeatureProbe/client-sdk-js/tree/main/example),
do some change and run the program again.

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
user.with("userId", /* userId */);

const fp = new FeatureProbe({
  remoteUrl: "https://featureprobe.io/server",
  // remoteUrl: "https://127.0.0.1:4007", // for local docker
  clientSdkKey: /* clientSdkKey */
  user,
});
fp.start();
```

Or via CDN:

```js
const user = new featureProbe.FPUser();
user.with("userId", /* userId */);

const fp = new featureProbe.FeatureProbe({
  remoteUrl: "https://featureprobe.io/server",
  // remoteUrl: "https://127.0.0.1:4007", // for local docker
  clientSdkKey: /* clientSdkKey */
  user,
});
fp.start();
```

### Step 3. Use the instance to get your setting value

You can use sdk to check which value this user will receive for a given feature flag.

```js
fp.on("ready", function() {
  const result = fp.boolValue(/* toggleKey */, false);
  if (result) {
    do_some_thing();
  } else {
    do_other_thing();
  }
  const reason = fp.boolDetail(/* toggleKey */, false);
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
    let t = fp.boolValue(/* toggleKey */, false);
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
    let t = fp.boolValue(/* toggleKey */, false);
    expect(t).toBe(true);
    done();
  });
});
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
| timeoutInterval   | no            | 1000    | Timeout for SDK initialization, SDK will emit an `error` event when timeout is reaching  |


## SDK Open API：

API Docs: [SDK API](https://featureprobe.github.io/client-sdk-js/)

## SDK Events：

- **ready** - Emit `ready` event after successfully fetching toggles from `Server`
- **cache_ready** - Emit `cache_ready` event after successfully fetching toggles from `LocalStorage`
- **error** - Emit `error` event when error fetching toggles from `Server` and timeout exceeded
- **update** - Emit `update` event every time successfully fetching toggles from `Server`, except for the first time (Emit `ready` event first time)

## Testing

```js
npm run test
```
