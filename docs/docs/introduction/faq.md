---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# FAQ

Here are some common problems and solutions during the use of FeatureProbe.

## 1. Common problems
### 1.1 How is the FeatureProbe flow controlled (what is the StableRollout Key)?

- The StableRollout Key is the only basis for rolling out by percentage, and it is not required parameter, and it is only useful when *a percentage rollout* is used.
- If a percentage rollout is used and the StableRollout Key is not passed in, the current timestamp is used as the StableRollout Key to divide flowå each time the SDK is accessed.
- If a percentage rollout is used, it is recommended to pass in any id that can uniquely identify this request as the StableRollout Key value. FeatureProbe does not care about the semantics of the incoming Key, but treats it as an arbitrary string, and requires the user to ensure the quality of the passed parameter according to the configuration agreement. For example: if the incoming key is username, then the flow is divided by username; if the incoming key is a fixed value, then the returned variation remains unchanged.
- For specific usage, please refer to the tutorial: [Use Toggle to Roll out a Feature](/tutorials/rollout_tutorial/)

### 1.2 How to ensure that a same user always get the same variation?

- If the StableRollout Key passed into the FeatureProbe SDK remains unchanged, and the flow admission/grouping rule configuration remains unchanged, the user will always get a certain variation. This is the default behavior of FeatureProbe and no special configuration is required.

### 1.3 How to modify FeatureProbe toggles by API?

- FeatureProbe provides Open API to manage information such as projects, toggles (query, create, modify, publish, etc.) and environments, covering all operations on the current FeatureProbe management platform. See [OpenAPI Documentation](https://featureprobe.io/api-docs) for details.

### 1.4 How to solve "You have no X applications listening for SDK events for X in the X environment" in user guidance of SDK initialization?

- Check whether `RemoteURL` and `ServerSdkKey` or `ClientSdkKey` are consistent with the environment where the current access toggle is located:

  - RemoteUrl
    - Official online test environment: https://featureprobe.io/server
    - Docker-compose environment: http://{docker compose runnig machine IP address}:4007
    - Docker image deployment or source code deployment: http://{FEATURE_PROBE_SERVER_IP}:{FP_SERVER_PORT}
  - ServerSdkKey: *<[How to get ServerSdkKey](/tutorials/backend_custom_attribute#编写代码)>*
  - ClientSdkKey: *<[How to get ClientSdkKey](/tutorials/backend_custom_attribute#控制前端程序)>*

- Check that the FeatureProbe Server service running:

  - Official online test environment: Whether `ping featureprobe.io` has timeout or severe packet loss, you can adjust the SDK timeout.

  - Docker image deployment or source code deployment:

    ```bash
    curl "http://{FEATURE_PROBE_SERVER_IP}:{FP_SERVER_PORT}"
    
    <h1>Feature Probe Server</h1> # <- Displaying this means that the service is normal
    ```

- Try to adjust the timeout for SDK to connect to FeatureProbe Server (for example, adjust it to 5 seconds):

  <Tabs groupId="language">
     <TabItem value="java" label="Java" default>

  ~~~java  title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
  private static final FPConfig config = FPConfig.builder()
          .remoteUri(remoteUri)
          // highlight-start
    		.pollingMode(Duration.ofSeconds(5L))
          // highlight-end
          .build();
  ~~~
  
    </TabItem>
    <TabItem value="golang" label="Go">
  
  ~~~go title="example/main.go"
  config := featureprobe.FPConfig{
      RemoteUrl:       RemoteUrl,
      ServerSdkKey:    ServerSdkKey,
      // highlight-start
      RefreshInterval: 5000, // ms
      // highlight-end
  }
  ~~~

  </TabItem>
  <TabItem value="rust" label="Rust">
  
  ~~~rust title="examples/demo.rs"
  let config = FPConfig {
      remote_url: remote_url,
      server_sdk_key: server_sdk_key,
    // highlight-start
      refresh_interval: Duration::from_secs(5),
    // highlight-end
  };
  ~~~
  
  </TabItem>
  <TabItem value="python" label="Python">
  
  ~~~python title="demo.py"
  config = fp.Config(remote_uri=remote_url,
                     sync_mode='polling',
                    # highlight-start
                     refresh_interval=5) #seconds
   									# highlight-end
  ~~~
  
  </TabItem>
  <TabItem value="nodejs" label="Node.js">

  ~~~js title="example/demo.js"
  const fp = new featureProbe.FeatureProbe({
    remoteUrl: FEATURE_PROBE_SERVER_URL,
    serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,
    // highlight-start
    timeoutInterval: 5000,
    // highlight-end
  });
  ~~~
  </TabItem>
  <TabItem value="JavaScript" label="JavaScript">
  
  ~~~js title="example/index.html"
  const fp = new FeatureProbe({
    remoteUrl: /* remoteUrl */,
    clientSdkKey: /* clientSdkKey */
    user: /* user */
    // highlight-start
    timeoutInterval: 5000, // 5 seconds
    // highlight-end
  })
  ~~~
  
  </TabItem>
  <TabItem value="MiniProgram" label="MiniProgram">
  
  ~~~js title="example/app.js"
  import { initialize } from "featureprobe-client-sdk-miniprogram";

  const fp = initialize({
    remoteUrl: /* remoteUrl */,
    clientSdkKey: /* clientSdkKey */,
    user: /* user */,
    // highlight-start
    timeoutInterval: 5000, // 5 seconds
    // highlight-end
  })
  ~~~
  
  </TabItem>
  <TabItem value="React" label="React">
  
  ~~~js title="demo.tsx"
  <FPProvider 
    config={{
      remoteUrl: /* remoteUrl */,
      clientSdkKey: /* clientSdkKey */,
      user:  /* user */,
      // highlight-start
      timeoutInterval: 5000, // 5 seconds
      // highlight-end
    }}
  >
    <div className="App"></div>
  </FPProvider>
  ~~~
  
  </TabItem>
  </Tabs>


- The front-end SDKs can listen to the `error` event triggered by the SDK, and you can also see the error details in the browser console:

<Tabs groupId="language">
<TabItem value="JavaScript" label="JavaScript">

  ~~~js title="example/index.html"
  fp.on("error", function() {
      console.log("Error initing Javascript SDK!")
  })
  ~~~

</TabItem>

<TabItem value="MiniProgram" label="MiniProgram">

  ~~~js title="example/app.js"
  fp.on("error", function() {
    console.log("Error initing MiniProgram SDK!")
  })
  ~~~

</TabItem>

<TabItem value="React" label="React">

  ~~~js title="example/provider/src/components/HookComponent.tsx"
  import { useFPClient } from 'featureprobe-client-sdk-react';

  const fp = useFPClient();

  fp.on("error", function() {
    console.log("Error initing React SDK!")
  })
  ~~~

</TabItem>
</Tabs>



### 1.5 How to solve "You have no X applications listening for X event in the X environment" in user guidance of tracking events?

<!-- - Please make sure that the test application displays "✅ Event tracked successfully" first. If you receive a prompt saying "You don't have any application with successful SDK key connection", please follow the troubleshooting steps corresponding to section [1.4](/introduction/faq#14-how-to-solve-you-have-no-applications-connected-using-this-sdk-key-in-user-guidance-of-sdk-initialization) first. -->

- Confirm that the collection of metric data is in the enabled state. For instructions on how to do this, please refer to the "[Save metrics and start iteration](/tutorials/analysis#save-metrics-and-start-iteration)" section.

- If the metric's event type is "custom event", you need to use the track function provided by the SDK to report event data. The function call is as follows:

  Server side SDKs:
  <Tabs groupId="language">
    <TabItem value="java" label="Java" default>

    ~~~java  title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
    fp.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
    ~~~

    </TabItem>

    <TabItem value="golang" label="Go">
  
    ~~~go title="example/main.go"
    value := 99.9
    fp.track("YOUR_CUSTOM_EVENT_NAME", user, &value);
    ~~~

    </TabItem>

    <TabItem value="rust" label="Rust">

    ~~~rust title="examples/demo.rs"
    fp.track("YOUR_CUSTOM_EVENT_NAME", &user, Some(5.5));
    ~~~

    </TabItem>

    <TabItem value="python" label="Python">
  
    ~~~python title="demo.py"
    fp.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
    ~~~
    
    </TabItem>
    <TabItem value="nodejs" label="Node.js">

    ~~~js title="example/demo.js"
    fp.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);
    ~~~
    
    </TabItem>

  </Tabs>

  Client side SDKs:
  
  <Tabs groupId="language">

    <TabItem value="JavaScript" label="JavaScript">

    ~~~js title="example/index.html"
    fp.track('YOUR_CUSTOM_EVENT_NAME', 5.5);
    ~~~
    
    </TabItem>

    <TabItem value="Android" label="Android">

    ~~~bash
    fp.track("YOUR_CUSTOM_EVENT_NAME", 5.5)
    ~~~
    
    </TabItem>

    <TabItem value="Swift" label="Swift">

    ~~~bash
    fp.track(event: "YOUR_CUSTOM_EVENT_NAME", value: 5.5)
    ~~~
    
    </TabItem>

    <TabItem value="Objective-C" label="Objective-C">

    ~~~bash
    [fp trackWithEvent:@"YOUR_CUSTOM_EVENT_NAME" value:5.5];
    ~~~
    
    </TabItem>

    <TabItem value="MiniProgram" label="MiniProgram">

    ~~~js title="example/app.js"
    featureProbeClient.track('YOUR_CUSTOM_EVENT_NAME', 5.5);
    ~~~
    
    </TabItem>

    <TabItem value="React" label="React">

    ~~~js title="example/provider/src/components/HookComponent.tsx"
    import { useFPClient } from 'featureprobe-client-sdk-react';

    const fp = useFPClient();

    fp.track('YOUR_CUSTOM_EVENT_NAME', 5.5);
    ~~~
    
    </TabItem>

  </Tabs>

  Please note that `YOUR_CUSTOM_EVENT_NAME` must match the "Event Name" in the metric.

- If the metric's event type is "Page Event" or "Click Event", please use the JavaScript and React SDK for integration (without manual event reporting). Also, make sure that the "Target Page URL" set in the metric matches the page URL for reporting events. For "Click Events", make sure that the CSS selector for the "click element" set in the


## 


## 2. Deployment problems

Writing, coming soon.

## 3. Analysis Diagnose

### 3.1 No variation records
Variation records is upload automatically when SDK value evaluation. There are some reasons when this error messaege show：
  - No SDK value evaluation ，like  `fpClient.boolValue(YOUR_TOGGLE_KEY, user, false)` is not called
  - URL is wrong when init SDK. SDK can not upload varation data to backend

### 3.2 No event records
Event records is generated when user call `track` api. There are some reasons when this error message show:
  - No track api called, like  `fpClient.track("YOUR_CUSTOM_EVENT_NAME", user, 5.5);` is not called
  - URL is wrong when init SDK. SDK can not upload varation data to backend


### 3.3 No join records
Join records is varitiation records join on event records on same user_id. There are some reasons when this error message show:
 - No same user_id on both variation records and event records
