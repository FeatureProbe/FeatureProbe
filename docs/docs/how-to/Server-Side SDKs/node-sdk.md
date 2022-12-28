---
sidebar_position: 4
---

# Node.js SDK

Feature Probe is an open source feature management service. This SDK is used to control features in Node.js programs.
This SDK is designed primarily for use in multi-user systems such as web servers and applications.

## Try Out Demo Code

We provide a runnable [demo code](https://github.com/FeatureProbe/server-sdk-node/blob/main/example) for you to understand how FeatureProbe SDK is used.

1. Select a FeatureProbe platform to connect to.
    * You can use our online demo environment [FeatureProbe Demo](https://featureprobe.io/login).
    * Or you can use docker composer to [set up your own FeatureProbe service](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. Download this repo, then build the latest distribution:

```bash
git clone https://github.com/FeatureProbe/server-sdk-node.git
cd server-sdk-node
npm install
npm run build
```

3. Find the Demo code in `example/demo.js`, change `FEATURE_PROBE_SERVER_URL` and
   `FEATURE_PROBE_SERVER_SDK_KEY` to match the platform you selected.
    * For online demo environment:
        * `FEATURE_PROBE_SERVER_URL` = "https://featureprobe.io/server"
        * `FEATURE_PROBE_SERVER_SDK_KEY` please copy from GUI:
          ![server_sdk_key snapshot](/server_sdk_key_en.png)
    * For docker environment:
        * `FEATURE_PROBE_SERVER_URL` = "http://YOUR_DOCKER_IP:4009/server"
        * `FEATURE_PROBE_SERVER_SDK_KEY` = "server-8ed48815ef044428826787e9a238b9c6a479f98c"

4. Run the program.
```bash
node example/demo.js
```

## Step-by-Step Guide

In this guide we explain how to use feature toggles in a Node.js application using FeatureProbe.

### Step 1. Install the Node.js SDK

First, install the FeatureProbe SDK as a dependency in your application.

#### NPM

```bash
npm install featureprobe-server-sdk-node --save
```

### Step 2. Create a FeatureProbe instance

After you install the SDK, import it, then create a single, shared instance of the FeatureProbe SDK.

```javascript
const fp = new FeatureProbe({
    remoteUrl: 'https://featureprobe.io/server',  // or https://127.0.0.1:4007
    serverSdkKey: /* FEATURE_PROBE_SERVER_SDK_KEY mentioned above */,
    refreshInterval: 5000,
});

await fp.start(1000);  // wait for up to 1 second for the first refresh
// await fp.start();  // init with time limit
```

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```javascript
const user = new User(/* uniqueUserId for percentage rollout */);
user.with('ATTRIBUTE_NAME_IN_RULE', VALUE_OF_ATTRIBUTE);  // call with() for each attribute, or extendAttrs(attributeMap) for attributes

const boolValue = fp.booleanValue('YOUR_TOGGLE_KEY', user, false);
if (boolValue) {
   // the code to run if the toggle is on
} else {
   // the code to run if the toggle is off
}
```

## Testing

We have unified integration tests for all our SDKs. Integration test cases are added as submodules for each SDK repo. So
be sure to pull submodules first to get the latest integration tests before running tests.

```shell
git pull --recurse-submodules
npm run test
```
