---
sidebar_position: 3
---

# Golang SDK

Feature Probe is an open source feature management service. This SDK is used to control features in golang programs. 
This SDK is designed primarily for use in multi-user systems such as web servers and applications.

## Try Out Demo Code

We provide a runnable [demo code](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/example/) for you to understand how FeatureProbe SDK is used.

1. Select a FeatureProbe platform to connect to.
    * You can use our online demo environment [FeatureProbe Demo](https://featureprobe.io/login).
    * Or you can use docker composer to [set up your own FeatureProbe service](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. Download this repo and run the demo program:
```bash
git clone https://github.com/FeatureProbe/server-sdk-go.git
cd server-sdk-go
go run example/main.go
```
3. Find the Demo code in [example](https://github.com/FeatureProbe/server-sdk-go/tree/main/example), 
do some change and run the program again.
```bash
go run main.go
```

## Step-by-Step Guide

In this guide we explain how to use feature toggles in a Golang application using FeatureProbe.

### Step 1. Install the Golang SDK

Fisrt import the FeatureProbe SDK in your application code:

```go
import "github.com/featureprobe/server-sdk-go"
```

Fetch the FeatureProbe SDK as a dependency in `go.mod`.

```shell
go get github.com/featureprobe/server-sdk-go
```

### Step 2. Create a FeatureProbe instance

After you install and import the SDK, create a single, shared instance of the FeatureProbe sdk.

```go

config := featureprobe.FPConfig{
    RemoteUrl:       "FEATURE_PROBE_SERVER_URL",
    ServerSdkKey:    "FEATURE_PROBE_SERVER_SDK_KEY",
    RefreshInterval: 1000,
}

fp, err := featureprobe.NewFeatureProbe(config)
```

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```go
user := featureprobe.NewUser("USER_ID_FOR_PERCENTAGE_ROLLOUT")
user.With("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);    // Call With() for each attribute used in Rule.
val := fp.BoolValue("YOUR_TOGGLE_KEY", user, true)
```

### Step 4. Unit Testing (Optional)

```go
toggles := map[string]interface{}{}
toggles["bool_toggle"] = true

fp := featureprobe.NewFeatureProbeForTest(toggles)
user := featureprobe.NewUser("user")

assert.Equal(t, fp.BoolValue("bool_toggle", user, false), true)
```

## Testing SDK

We have unified integration tests for all our SDKs. Integration test cases are added as submodules for each SDK repo. So
be sure to pull submodules first to get the latest integration tests before running tests.

```shell
git pull --recurse-submodules
go test
```