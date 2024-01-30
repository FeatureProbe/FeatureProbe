---
sidebar_position: 7
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use metric analysis


We will guide you to use the metric analysis function of the FeatureProbe platform. By writing back-end/front-end programs, use the SDK to realize the data reporting of `custom events`, and view the analysis results on the platform.


## Create a toggle on the platform
1. Log in to the FeatureProbe [demo platform](https://featureprobe.io). If you log in for the first time, please enter your email address. You can continue to use your email to access your data in the future.
2. Click `+Toggle` to create a new toggle.
![add](/tutorial_create_toggle_button_en.png)
3. Set the name and key to `custom_event`, click `Create and publish`.
![create](/tutorial_metric_analysis_create_en.png)
4. Click `custom_event` from the toggle list to open the targeting details page.
![list](/tutorial_metric_analysis_list_click_en.png)
6. Set the status to `enabled`.
Change the return variation of the default rule to `a percentage rollout`. Set 50% to variation1, 50% to variation2.
![list](/tutorial_metric_analysis_targeting_en.png)
6. Click the `Publish` button below and `Confirm` the changes.
![list](/tutorial_metric_analysis_targeting_confirm_en.png)


## Save metrics and start iteration
1. Open the `Analysis` Tab, Add a metric named `Button Click Conversion`, select the metric type as `Conversion` then select `Custom` event type, configure the event name as `test_event`, and click `Save`.
![list](/tutorial_metric_analysis_save_en.png)

2. After the metric is saved successfully, click the `Start iteration` button to start collecting data.
![list](/tutorial_metric_analysis_start_en.png)

## Control the backend program
We provide a backend code example, from which you can start to experience how the backend code report custom event.

### Write code {#backend-code}

1. According to the language you are familiar with, download and open the corresponding back-end sample code.

<Tabs groupId="language">
<TabItem value="java" label="Java" default>

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-java.git
cd server-sdk-java
~~~
Open `src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java` file with an editor.

</TabItem>

<TabItem value="golang" label="Go">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-go.git
cd server-sdk-go
~~~
Open the `example/main.go` file with an editor.
</TabItem>
<TabItem value="rust" label="Rust">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-rust.git
cd server-sdk-rust
~~~
Open the `examples/demo.rs` file with an editor.
</TabItem>
<TabItem value="python" label="Python">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-python.git
cd server-sdk-python
~~~
Open the `demo.py` file with an editor.
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-node.git
cd server-sdk-node
~~~
Open the `examples/demo.js` file with an editor.
</TabItem>

</Tabs>

2. Open the FeatureProbe platform [project list page](https://featureprobe.io/projects), you can click `Projects` on the toggle details page to open: 
![project](/tutorial_click_project_en.png)

3. Copy `Server SDK Key`.
![sdk key](/tutorial_rollout_server_sdk_key_en.png)

4. Fill in `Server SDK Key` and `FeatureProbe remote URL` ("https://featureprobe.io/server") into the corresponding variables of the backend code.

<Tabs groupId="language">
<TabItem value="java" label="Java" default>

~~~java title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
    private static final String FEATURE_PROBE_SERVER_URL = "https://featureprobe.io/server";
    private static final String FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key
~~~
</TabItem>


<TabItem value="golang" label="Go">

~~~go title="example/main.go"
config := featureprobe.FPConfig{
    // highlight-start
  RemoteUrl: "https://featureprobe.io/server",
  ServerSdkKey:    // Fill in the server SDK key
  // highlight-end
  RefreshInterval: 5000, // ms
  WaitFirstResp:   true,
}
~~~
</TabItem>
<TabItem value="rust" label="Rust">

~~~rust title="examples/demo.rs"
let remote_url = "https://featureprobe.io/server";
let server_sdk_key = // Fill in the server SDK key
~~~
</TabItem>
<TabItem value="python" label="Python">

~~~python title="demo.py"
FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server'
FEATURE_PROBE_SERVER_SDK_KEY = # Fill in the server SDK key
~~~
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~js title="demo.js"
const FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server';
const FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key
~~~
</TabItem>

</Tabs>

5. Add the following code. Simulate 1000 users accessing the toggle. Among the users whose toggle return value is `true`, 55% of them report custom events, and among users whose toggle return value is `false`, 45% of them report custom events.

<Tabs groupId="language">
   <TabItem value="java" label="Java" default>

~~~java title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
    public static void main(String[] args) throws IOException, InterruptedException {

        Logger root = (Logger)LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);
        root.setLevel(Level.WARN);

        final FPConfig config = FPConfig.builder()
          .remoteUri(FEATURE_PROBE_SERVER_URL)
          .build();

        // Init FeatureProbe, share this FeatureProbe instance in your project.
        final FeatureProbe fpClient = new FeatureProbe(FEATURE_PROBE_SERVER_SDK_KEY, config);

        final String YOUR_TOGGLE_KEY = "custom_event";
        final String YOUR_EVENT_NAME = "test_event";

        // highlight-start
        for (int i = 0; i < 1000; i++) {
            FPUser user = new FPUser().stableRollout(String.valueOf(System.nanoTime()));
            boolean newFeature = fpClient.boolValue(YOUR_TOGGLE_KEY, user, false);
            Random random = new Random();
            int randomRang = random.nextInt(100);
            if (newFeature) {
                if (randomRang <= 55) {
                    fpClient.track(YOUR_EVENT_NAME, user);
                }
            } else {
                if (randomRang > 55) {
                    fpClient.track(YOUR_EVENT_NAME, user);
                }
            }
            Thread.sleep(300);
        }
        // highlight-end

        fpClient.close();
    }
~~~

</TabItem>

<TabItem value="golang" label="Go">

~~~go title="example/main.go"
package main

import (
	"fmt"
	featureprobe "github.com/featureprobe/server-sdk-go/v2"
	"math/rand"
	"time"
)

func main() {

	config := featureprobe.FPConfig{
		RemoteUrl: FEATURE_PROBE_SERVER_URL,
		ServerSdkKey:    FEATURE_PROBE_SERVER_SDK_KEY,
		RefreshInterval: 2 * time.Second,
		StartWait:       5 * time.Second,
	}
	fp := featureprobe.NewFeatureProbe(config)
	if !fp.Initialized() {
		fmt.Println("SDK failed to initialize!")
	}


  // highlight-start
	for i := 1; i <= 1000; i++ {
		user := featureprobe.NewUser().StableRollout(fmt.Sprintf("%d", time.Now().UnixNano()/1000000))
		newFeature := fp.BoolValue(YOUR_TOGGLE_KEY, user, false)
		rand.Seed(time.Now().UnixNano())
		randomNum := rand.Intn(101)
		if newFeature {
			if randomNum <= 55 {
				fp.Track(YOUR_EVENT_NAME, user, nil)
			}
		} else {
			if randomNum > 55 {
				fp.Track(YOUR_EVENT_NAME, user, nil)
			}
		}
	}
  // highlight-end

	fp.Close()
}
~~~
</TabItem>
<TabItem value="rust" label="Rust">

~~~rust title="examples/demo.rs"
#[tokio::main]
async fn main() {
    let remote_url = FEATURE_PROBE_SERVER_URL;
    let server_sdk_key = FEATURE_PROBE_SERVER_SDK_KEY;
    let config = FPConfig {
        remote_url: remote_url.to_owned(),
        server_sdk_key: server_sdk_key.to_owned(),
        refresh_interval: Duration::from_millis(2000),
        ..Default::default()
    };

    let fp = match FeatureProbe::new(config) {
        Ok(fp) => fp,
        Err(e) => {
            tracing::error!("{:?}", e);
            return;
        }
    };

    // highlight-start
    for i in 0..1000 {
        let mut rng = rand::thread_rng();
        let random_number = rng.gen_range(0..=100);
        let mut user = FPUser::new().stable_rollout(Utc::now().timestamp_millis().to_string());
        let new_feature = fp.bool_value(YOUR_TOGGLE_KEY, &user, false);
        if new_feature {
            if random_number <= 55 {
                fp.track(YOUR_EVENT_NAME, &user, None);
            }
        } else {
            if random_number > 55 {
                fp.track(YOUR_EVENT_NAME, &user, None);
            }
        }
    }
    // highlight-end

    fp.close();
}
~~~
</TabItem>
<TabItem value="python" label="Python">

~~~python title="demo.py"
logging.basicConfig(level=logging.WARNING)

if __name__ == '__main__':
    FEATURE_PROBE_SERVER_URL = FEATURE_PROBE_SERVER_URL
    FEATURE_PROBE_SERVER_SDK_KEY = FEATURE_PROBE_SERVER_SDK_KEY # Fill in the server SDK key

    config = fp.Config(remote_uri=FEATURE_PROBE_SERVER_URL,  # FeatureProbe server URL
                       sync_mode='polling',
                       refresh_interval=3)

    with fp.Client(FEATURE_PROBE_SERVER_SDK_KEY, config) as client:
    
    # highlight-start
    for i in range(1000):
      random_number = random.randint(0, 100)
      user = fp.User().stable_rollout(str(time.time()))
      new_feature = client.value(YOUR_TOGGLE_KEY, user, default=False)
      if new_feature:
        if random_number <= 55:
          client.track(YOUR_EVENT_NAME, user, None)
      else:
        if random_number5> 55
          client.track(YOUR_EVENT_NAME, user, None)
    # highlight-end      
    client.close()
~~~
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~js title="demo.js"
const fpClient = new featureProbe.FeatureProbe({
  remoteUrl: FEATURE_PROBE_SERVER_URL,
  serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,
  refreshInterval: 5000,
});

const YOUR_TOGGLE_KEY = "custom_event";
const YOUR_EVENT_NAME = "test_event";
    
// highlight-start
for(let i = 0; i < 1000; i++) {
  const user = new featureProbe.FPUser(Date.now());
  const boolValue = fpClient. boolValue(YOUR_TOGGLE_KEY, user, false);
  const random = Math.floor(Math.random() * (100 - 1) + 1);

  if (boolValue) {
    if (random <= 55) {
      fpClient.track(YOUR_EVENT_NAME, user);
    }
  } else {
    if (random > 55) {
      fpClient.track(YOUR_EVENT_NAME, user);
    }
  }
}
// highlight-end

fpClient.close();
~~~
</TabItem>

</Tabs>

6. Run the program.

<Tabs groupId="language">
  <TabItem value="java" label="Java" default>

  ~~~bash
  mvn package
  java -jar ./target/server-sdk-java-1.4.0.jar
  ~~~
  </TabItem>

  <TabItem value="golang" label="Go">

  ~~~bash
  go run example/main.go
  ~~~
  </TabItem>
  <TabItem value="rust" label="Rust">

  ~~~bash
  cargo run --example demo
  ~~~
  </TabItem>
  <TabItem value="python" label="Python">

  ~~~bash
  pip3 install -r requirements.txt
  python3 demo.py
  ~~~
  </TabItem>
  <TabItem value="nodejs" label="Node.js">

  ~~~bash
  node demo.js
  ~~~
  </TabItem>

</Tabs>


## Control the front-end program

We provide a front-end js code example, and you can start to experience how the front-end code report custom event.

### Write code {#frontend-code}

1. Clone the code.

~~~bash
git clone https://github.com/FeatureProbe/client-sdk-js.git
cd client-sdk-js
~~~

2. Open [platform](https://featureprobe.io/projects) to get client sdk key.

:::info
Click the "Projects" tab to enter the "Projects" list, obtain various SDK keys, and modify service and environment information.
:::

![client sdk key](/tutorial_client_sdk_key_en.png)

3. Open `example/index.html` and fill in `Client SDK Key` and `FeatureProbe URL` ("https://featureprobe.io/server")

~~~js title="example/index.html"
const fpClient = new featureProbe. FeatureProbe({
  // highlight-start
  remoteUrl: "https://featureprobe.io/server",
  clientSdkKey: // Paste client sdk key here,
  // highlight-end
  user,
  refreshInterval: 5000,
});
~~~

5. Add the following code. 
Simulate a lot of users are accessing the toggle. Among the users whose toggle return value is `true`, 55% of them report custom events, and among users whose toggle return value is `false`, 45% of them report custom events.

~~~js title="example/index.html"
<script>
  const user = new featureProbe.FPUser();

  const fpClient = new featureProbe.FeatureProbe({
    remoteUrl: "https://featureprobe.io/server",
    clientSdkKey: // Paste client sdk key here,
    user,
    refreshInterval: 1000,
  });

  const YOUR_TOGGLE_KEY = "tutorial_rollout";
  const YOUR_EVENT_NAME = 'test_event';

  fpClient.waitUntilReady().then(() => {
    // highlight-start
    const boolValue = fpClient. boolValue(YOUR_TOGGLE_KEY, false);
    const random = Math.floor(Math.random() * (100 - 1) + 1);

    if (boolValue) {
      if (random <= 55) {
        fpClient.track(YOUR_EVENT_NAME);
      }
    } else {
      if (random > 55) {
        fpClient.track(YOUR_EVENT_NAME);
      }
    }

    // Reload page to simulate a new user visiting the page
    setTimeout(() => {
      location.reload();
    }, 1100);
    // highlight-end
  })

  fpClient.start();

</script>
~~~

## Validate results

Open the `Analysis` Tab on platform to view the result.
![result](/tutorial_metric_analysis_result_en.png)
