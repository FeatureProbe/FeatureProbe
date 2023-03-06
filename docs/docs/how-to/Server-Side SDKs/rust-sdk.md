---
sidebar_position: 6
---

# Rust SDK

FeatureProbe is an open source feature management service. This SDK is used to control features in Rust programs. This SDK is designed primarily for use in multi-user systems such as web servers and applications.

:::note SDK quick links
In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API documentation  | [ SDK API docs](https://docs.rs/feature-probe-server-sdk/latest/feature_probe_server_sdk/) |
| GitHub repository | [Server-SDK for Rust](https://github.com/FeatureProbe/server-sdk-rust) |
| Sample applications      | [Demo code](https://github.com/FeatureProbe/server-sdk-rust/blob/main/examples/demo.rs) |
| Published module    | [crates.io](https://crates.io/crates/feature-probe-server-sdk) |

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

### Step 1. Install the Rust SDK

First, install the FeatureProbe SDK as a dependency in your application.

```shell
cargo install cargo-edit
cargo add feature-probe-server-sdk-rs --allow-prerelease
```

Next, import the FeatureProbe SDK in your application code:

```rust
use feature_probe_server_sdk::{FPConfig, FPUser, FeatureProbe};
```

### Step 2. Create a FeatureProbe instance

After you install and import the SDK, create a single, shared instance of the FeatureProbe sdk.

```rust
fn main() {
    let remote_url = url::Url::parse("http://localhost:4007").expect("invalid url");
    // Server SDK key in Project List Page.
    let server_sdk_key = "server-7fa2f771259cb7235b96433d70b91e99abcf6ff8".to_owned();

    let config = FPConfig {
        remote_url,
        server_sdk_key,
        refresh_interval: Duration::from_secs(5),
        start_wait: Some(Duration::from_secs(5)),
        ..Default::default()
    };

    let fp =  FeatureProbe::new(config);
    if !fp.initialized() {
        println!("FeatureProbe failed to initialize, will return default value");
    }
}
```

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```rust
let user = FPUser::new().with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);
let show_feature = fp.bool_value("YOUR_TOGGLE_KEY", &user, false);

if show_feature {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}
```

### Step 4. Close FeatureProbe Client before program exits

Close the client before exiting to ensure accurate data reporting.

```rust
fp.close();
```

## Track Events

:::note
The Rust SDK supports event tracking from version 2.0.1.
:::

The event tracking feature can record the actions taken by the user in the application as events.
Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).
```rust
fp.track("YOUR_CUSTOM_EVENT_NAME", &user, None);
// Providing a metric value to track
fp.track("YOUR_CUSTOM_EVENT_NAME", &user, Some(5.5));
```

## Unit Testing

FeatureProbe SDK provides a set of mock mechanism, which can specify the return value of FeatureProbe SDK in unit test.

```rust
let fp = FeatureProbe::new_for_test("toggle_1", Value::Bool(false));
let u = FPUser::new();
assert_eq!(fp.bool_value("toggle_1", &u, true), false);

let mut toggles: HashMap<String, Value> = HashMap::new();
toggles.insert("toggle_2".to_owned(), json!(12.5));
toggles.insert("toggle_3".to_owned(), json!("value"));
let fp = FeatureProbe::new_for_tests(toggles);
assert_eq!(fp.number_value("toggle_2", &u, 20.0), 12.5);
assert_eq!(fp.string_value("toggle_3", &u, "val".to_owned()), "value");
```

## Customize SDK

:::tip
This paragraph applies to users who want to customize this SDK, or contribute code to this SDK through the open source community. Other users can skip this section.
:::

We provide an acceptance test of this SDK to ensure that the modified SDK is compatible with the native rules of FeatureProbe.
Integration test cases are added as submodules of each SDK repository. So be sure to pull the submodule first to get the latest integration tests before running the tests.

```shell
git pull --recurse-submodules
cargo test
```
