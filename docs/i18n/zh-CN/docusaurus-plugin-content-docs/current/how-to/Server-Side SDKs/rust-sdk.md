---
sidebar_position: 6
---

# Rust SDK

本文介绍如何在一个 Rust 项目中使用 FeatureProbe SDK。

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示：

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API 文档  | [ SDK API docs](https://docs.rs/feature-probe-server-sdk/latest/feature_probe_server_sdk/) |
| GitHub 代码库 | [Server-SDK for Rust](https://github.com/FeatureProbe/server-sdk-rust) |
| 接入示例      | [Demo code](https://github.com/FeatureProbe/server-sdk-rust/blob/main/examples/demo.rs) |
| 已发布模块    | [crates.io](https://crates.io/crates/feature-probe-server-sdk) |

:::

:::tip
对于首次使用FeatureProbe的用户，我们强烈建议你在阅读过[灰度放量教程](../../tutorials/rollout_tutorial/)之后，再回到这篇文章继续阅读。
:::

## 接入业务代码

后端项目通常只需要实例化一个FeatureProbe SDK（Client）。
然后针对不同用户的请求，调用FeatureProbe Client获取对每一个用户的开关处理结果。

:::info
服务端SDK采用异步连接FeatureProbe服务器拉取判定规则的方式，判定规则会在本地存缓。所有对用户代码暴露的接口都只涉及内存操作，调用时不必担心性能问题。
:::

### 步骤 1. 安装 FeatureProbe SDK

首先，在您的应用程序中安装 FeatureProbe SDK 作为依赖项：

```shell
cargo install cargo-edit
cargo add feature-probe-server-sdk-rs --allow-prerelease
```

然后，在代码中引入：

```rust
use feature_probe_server_sdk::{FPConfig, FPUser, FeatureProbe};
```

### 步骤 2. 创建一个 FeatureProbe instance

安装并导入 SDK 后，创建 FeatureProbe sdk 的单个共享实例。

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

### 步骤 3. 使用 FeatureProbe 开关获取设置的值

您可以使用 sdk 拿到对应开关名设置的值。

```rust
let user = FPUser::new().with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);
let show_feature = fp.bool_value("YOUR_TOGGLE_KEY", &user, false);

if show_feature {
    # application code to show the feature
} else {
    # the code to run if the feature is off
}
```

### 步骤 4. 程序退出前关闭 FeatureProbe Client

退出前关闭client，保证数据上报准确。

```rust
fp.close();
```

## 接入业务单元测试

FeatureProbe SDK 提供了一套mock机制，可以在单元测试中指定FeatureProbe SDK的返回值。

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

## 定制化开发本SDK

:::tip
本段落适用于想自己定制化开发本SDK，或者通过开源社区对本SDK贡献代码的用户。一般用户可以跳过此段内容。
:::

我们提供了一个本SDK的验收测试，用于保证修改后的SDK跟FeatureProbe的原生规则兼容。
集成测试用例作为每个 SDK 存储库的子模块添加。所以在运行测试之前，请务必先拉取子模块以获取最新的集成测试。

```shell
git submodule update --init --recursive
cargo test
```
