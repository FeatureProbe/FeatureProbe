---
sidebar_position: 5
---

# Python SDK

Feature Probe is an open source feature management service. This SDK is used to control features in Python programs.
This SDK is designed primarily for use in multi-user systems such as web servers and applications.

## Try Out Demo Code

We provide a runnable [demo code](https://github.com/FeatureProbe/server-sdk-python/blob/main/demo.py) for you to understand how FeatureProbe SDK is used.

1. Select a FeatureProbe platform to connect to.
    * You can use our online demo environment [FeatureProbe Demo](https://featureprobe.io/login).
    * Or you can use docker composer to [set up your own FeatureProbe service](https://github.com/FeatureProbe/FeatureProbe#1-starting-featureprobe-service-with-docker-compose)

2. Download this repo:

```bash
git clone https://github.com/FeatureProbe/server-sdk-python.git
cd server-sdk-python
```

3. Find the Demo code in [demo.py](https://github.com/FeatureProbe/server-sdk-python/blob/main/demo.py), change `FEATURE_PROBE_SERVER_URL` and
   `SDK_KEY` to match the platform you selected.
    * For online demo environment:
        * `FEATURE_PROBE_SERVER_URL` = "https://featureprobe.io/server"
        * `SDK_KEY` please copy from GUI:
          ![server_sdk_key snapshot](/server_sdk_key_en.png)
    * For docker environment:
        * `FEATURE_PROBE_SERVER_URL` = "http://YOUR_DOCKER_IP:4009/server"
        * `SDK_KEY` = "server-8ed48815ef044428826787e9a238b9c6a479f98c"

4. Run the program.
```bash
pip3 install -r requirements.txt
python3 demo.py
```

## Step-by-Step Guide

In this guide we explain how to use feature toggles in a Python application using FeatureProbe.

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

config = fp.Config(remote_uri='http://127.0.0.1:4007', sync_mode='pooling', refresh_interval=3)
client = fp.Client('server-8ed48815ef044428826787e9a238b9c6a479f98c', config)
```

> NOTE: You can use the `context manager` (aka. `with`) to create a fp.Client that will auto close when the context is exited.

### Step 3. Use the feature toggle

You can use sdk to check which variation a particular user will receive for a given feature flag.

```python
user = fp.User(
    stable_rollout_key='user_unique_id',
    attrs={
        'userId': '9876',
        'tel': '12345678998',
    })
bool_eval = bool(client.value('bool_toggle_key', user, default=False))
if bool_eval:
    ...  # application code to show the feature
else:
    ...  # the code to run if the feature is off
```

## Testing

We have unified integration tests for all our SDKs. Integration test cases are added as submodules for each SDK repo. So
be sure to pull submodules first to get the latest integration tests before running tests.

```shell
git pull --recurse-submodules
pip3 install -r requirements-dev.txt
pytest featureprobe
```
