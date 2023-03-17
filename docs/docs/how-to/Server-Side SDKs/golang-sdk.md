---
sidebar_position: 3
---

# Golang SDK

FeatureProbe is an open source feature management service. This SDK is used to control features in golang programs. 
This SDK is designed primarily for use in multi-user systems such as web servers and applications.

:::note SDK quick links

In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**        | **Location** |
| --------------------------------------- | ----------------- |
| SDK API documentation | [ SDK API docs](https://pkg.go.dev/github.com/featureprobe/server-sdk-go#section-documentation) |
| GitHub repository | [Server-SDK for Golang](https://github.com/FeatureProbe/server-sdk-go) |
| Sample applications | [FeatureProbeDemo](https://github.com/FeatureProbe/server-sdk-go/tree/main/example) |
|Published module|[pkg.go.dev](https://pkg.go.dev/github.com/featureprobe/server-sdk-go)|

:::

:::tip
For users who are using FeatureProbe for the first time, we strongly recommend that you return to this article to continue reading after reading the [Gradual Rollout Tutorial](../../tutorials/rollout_tutorial/).
:::


## Step-by-Step Guide

Backend projects usually only need to instantiate a FeatureProbe SDK (Client).
According to the requests of different users, call the FeatureProbe Client to obtain the toggle result for each user.

:::info
The server-side SDK uses an asynchronous connection to the FeatureProbe server to pull judgment rules, and the judgment rules will be cached locally. All interfaces exposed to user code only involve memory operations, so there is no need to worry about performance issues when calling.
:::

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
    RemoteUrl:       /* FeatureProbe Server URI */,
    ServerSdkKey:    /* FeatureProbe Server SDK Key */,
    RefreshInterval: 2 * time.Second,
}

fpClient := featureprobe.NewFeatureProbe(config)

if !fpClient.Initialized() {
  fmt.Println("SDK failed to initialize!")
}
```

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```go
user := featureprobe.NewUser().With("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE)
toggle := fpClient.BoolValue("YOUR_TOGGLE_KEY", user, false)
if toggle {
    // the code to run if the toggle is on
} else {
    // the code to run if the toggle is off
}
```

### Step 4. Close FeatureProbe Client before program exits

Close the client before exiting to ensure accurate data reporting.

```go
fpClient.Close();
```


## Track Events

:::note
The Go SDK supports event tracking from version 2.0.1.
:::

The event tracking feature can record the actions taken by the user in the application as events.

Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).

```go
value := 99.9
fpClient.track("YOUR_CUSTOM_EVENT_NAME", user, nil)
// Providing a metric value to track
fpClient.track("YOUR_CUSTOM_EVENT_NAME", user, &value)
```


## Unit Testing

FeatureProbe SDK provides a set of mock mechanism, which can specify the return value of FeatureProbe SDK in unit test.

```go
toggles := map[string]interface{}{}
toggles["bool_toggle"] = true

fp := featureprobe.NewFeatureProbeForTest(toggles)
user := featureprobe.NewUser()

assert.Equal(t, fp.BoolValue("bool_toggle", user, false), true)
```

## Customize SDK

:::tip
This paragraph applies to users who want to customize this SDK, or contribute code to this SDK through the open source community. Other users can skip this section.
:::

We provide an acceptance test of this SDK to ensure that the modified SDK is compatible with the native rules of FeatureProbe.
Integration test cases are added as submodules of each SDK repository. So be sure to pull the submodule first to get the latest integration tests before running the tests.

```shell
git submodule update --init --recursive
go test
```
