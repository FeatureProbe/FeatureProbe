---
sidebar_position: 5
---

# Python SDK

FeatureProbe is an open source feature management service. This SDK is used to control features in Python programs.
This SDK is designed primarily for use in multi-user systems such as web servers and applications.

:::note SDK quick links

In addition to this reference guide, we provide source code, API reference documentation, and sample applications at the following links:

| **Resource**  | **Location**                                                 |
| ------------- | ------------------------------------------------------------ |
| SDK API documentation  | [ SDK API docs](https://test-fp-server-py.readthedocs.io/en/latest/api.html) |
| GitHub repository | [Server-SDK for Python](https://github.com/FeatureProbe/server-sdk-python) |
| Sample applications      | [Demo code](https://github.com/FeatureProbe/server-sdk-python/blob/main/demo.py) |
| Published module    | [ PyPI](https://pypi.org/project/featureprobe-server-sdk-python/) |

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


### Step 1. Install the Python SDK

First, install the FeatureProbe Server SDK in your environment.

#### pip

```bash
pip3 install featureprobe-server-sdk-python
```

> You may get the pre-release version SDK from [TestPyPI](https://test.pypi.org/project/featureprobe-server-sdk-python/)

<!-- WIP
#### conda

Will be supported later.

```bash
conda install featureprobe-server-sdk-python
```
-->

### Step 2. Create a FeatureProbe instance

After you install the SDK, import it, then create a single, shared instance of the FeatureProbe SDK.

```python
import featureprobe as fp

config = fp.Config(remote_uri=/* FeatureProbe Server URI */, sync_mode='polling', refresh_interval=3)
client = fp.Client(/* FeatureProbe Server SDK Key */, config)

if not client.initialized():
		print("SDK failed to initialize!")
```

> NOTE: You can use the `context manager` (aka. `with`) to create a fp.Client that will auto close when the context is exited.

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```python
user = fp.User().with_attr('ATTRIBUTE_NAME_IN_RULE', VALUE_OF_ATTRIBUTE)
bool_eval = bool(client.value('YOUR_TOGGLE_KEY', user, default=False))
if bool_eval:
    ...  # application code to show the feature
else:
    ...  # the code to run if the feature is off
```

## Track Events

:::note
The Python SDK supports event tracking from version 2.0.1.
:::

The event tracking feature can record the actions taken by the user in the application as events.

Events are related to toggle's metrics. For more information about event analysis, please read [Event Analysis](../../tutorials/analysis).

```go
fp.track("YOUR_CUSTOM_EVENT_NAME", user)
// Providing a metric value to track
fp.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5)
```



## Customize SDK

:::tip
This paragraph applies to users who want to customize this SDK, or contribute code to this SDK through the open source community. Other users can skip this section.
:::

We provide an acceptance test of this SDK to ensure that the modified SDK is compatible with the native rules of FeatureProbe.
Integration test cases are added as submodules of each SDK repository. So be sure to pull the submodule first to get the latest integration tests before running the tests.

```shell
git submodule update --init --recursive
git pull --recurse-submodules
pip3 install -r requirements-dev.txt
pytest featureprobe
```
