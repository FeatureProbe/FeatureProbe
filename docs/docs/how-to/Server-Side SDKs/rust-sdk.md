---
sidebar_position: 6
---

# Rust SDK

## Try Out Demo Code

We provide a runnable demo code for you to understand how FeatureProbe SDK is used.

1. Start FeatureProbe Service with docker composer. [How to](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)
2. Download this repo and run the demo program:
 ```bash
 git clone https://github.com/FeatureProbe/server-sdk-rust.git
 cd server-sdk-rust
 cargo run --example demo
 ```
3. Find the Demo code in [examples](https://github.com/FeatureProbe/server-sdk-rust/tree/main/examples), 
 do some change and run the program again.
 ```bash
 cargo run --example demo
 ```

## Step-by-Step Guide

In this guide we explain how to use feature toggles in a Rust application using FeatureProbe.

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
let user = FPUser::new().with("name", "bob");
let show_feature = fp.bool_value("your.toggle.key", &user, false);

if show_feature {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}
```

### Step 4. Unit Testing (Optional)

You could do unit testing for each variation:

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

## Testing SDK

We have unified integration tests for all our SDKs. Integration test cases are added as submodules for each SDK repo. So
be sure to pull submodules first to get the latest integration tests before running tests.

```shell
git pull --recurse-submodules
cargo test
```
