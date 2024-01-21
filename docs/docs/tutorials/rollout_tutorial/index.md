---
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use Toggle to Roll out a Feature

We will guide you to use the FeatureProbe platform to control a back-end or front-end program, and let the back-end or front-end program display new features by percentage of received user requests.

## Create a toggle on the platform

1. Log in to the FeatureProbe [demo platform](https://featureprobe.io). If you log in for the first time, please enter your email address. You can continue to use your email to access your data in the future.
2. Click `+Toggle` to create a new toggle.
![add](/tutorial_create_toggle_button_en.png)
3. Set the name and key to `tutorial_rollout`, click `Create and publish`.
![create](/tutorial_rollout_create_en.png)
4. Click `tutorial_rollout` from the toggle list to open the targeting details page.
![list](/tutorial_list_click_en.png)
5. Change the return variation of the default rule to `a percentage rollout`.
![return](/tutorial_return_percentage_en.png)
6. Set 10% to open the toggle (return true), 90% to close the toggle (return false), and set the status to `enabled`.
![10% true](/tutorial_rollout_enable_en.png)
7. Click the `Publish` button below and `Confirm` the changes.
![confirm](/tutorial_rollout_confirm_en.png)

Till now, the operation on the platform is complete. We have created a toggle to manage gradual rollout. Next, we will use it in the program to see the actual effect.

:::tip
After the toggle is created, it can be accessed in the back-end program or in the front-end program. Below we will introduce how to use it in **Back-end code** and [**Front-end code**](#control-the-front-end-program) this toggle, the two are independent of each other, you can choose to read the part you are interested in according to your needs.
:::

## Control the backend program

We provide a backend code example, from which you can start to experience how the backend code uses the toggle.

### Write code {#backend-code}

1. According to the language you are familiar with, download and open the corresponding back-end sample code.

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-java.git
cd server-sdk-java
~~~

Open `src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java` file with an editor.

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

2. Open the FeatureProbe platform [project list page](https://featureprobe.io/projects), you can click `Projects` on the toggle details page to open
![project](/tutorial_click_project_en.png)

3. Copy `Server SDK Key`
![sdk key](/tutorial_rollout_server_sdk_key_en.png)

4. Fill in `Server SDK Key` and `FeatureProbe remote URL` ("https://featureprobe.io/server") into the corresponding variables of the backend code

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

5. Add the following code to simulate 100 users accessing this toggle.

<Tabs groupId="language">
   <TabItem value="java" label="Java" default>

~~~java title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
    public static void main(String[] args) throws IOException {

        Logger root = (Logger)LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);
        root.setLevel(Level.WARN);

        final FPConfig config = FPConfig.builder()
            .remoteUri(FEATURE_PROBE_SERVER_URL)
            .build();

        // Init FeatureProbe, share this FeatureProbe instance in your project.
        final FeatureProbe fpClient = new FeatureProbe(FEATURE_PROBE_SERVER_SDK_KEY, config);

        //
        final String YOUR_TOGGLE_KEY = "tutorial_rollout";
        // highlight-start
        for (Integer i = 0; i < 100; i++) {
            FPUser user = new FPUser();
            Boolean isOpen = fpClient.boolValue(YOUR_TOGGLE_KEY, user, false);
            System.out.println("feature for user " + i + " is :" + isOpen);
        }
        // highlight-end
        fpClient.close();
    }
~~~

</TabItem>
<TabItem value="golang" label="Go">

~~~go title="example/main.go"
func main() {
	config := featureprobe.FPConfig{
		RemoteUrl: "https://featureprobe.io/server",
		ServerSdkKey:    // Fill in the server SDK key
		RefreshInterval: 5000, // ms
		WaitFirstResp:   true,
	}
	fp, err := featureprobe.NewFeatureProbe(config)
	if err != nil {
		fmt.Println(err)
		return
	}
    // highlight-start
	for i:=0; i<100; i++  {
		user := featureprobe.NewUser()
		detail := fp.BoolValue("tutorial_rollout", user, false)
		fmt.Println("feature for user", i, "is:", detail)
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
    let remote_url = "https://featureprobe.io/server";
    let server_sdk_key = // Fill in the server SDK key
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
    for n in 1..100 {
        let user = FPUser::new();
        let enable = fp.bool_value("tutorial_rollout", &user, false);
        println!("feature for user {:?} is: {:?}", n, enable);
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
    FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server'
    FEATURE_PROBE_SERVER_SDK_KEY = # Fill in the server SDK key

    config = fp.Config(remote_uri=FEATURE_PROBE_SERVER_URL,  # FeatureProbe server URL
                       sync_mode='polling',
                       refresh_interval=3)

    with fp.Client(FEATURE_PROBE_SERVER_SDK_KEY, config) as client:
      # highlight-start
        for i in range(100):
            user = fp.User()
            is_open = client.value('tutorial_rollout', user, default=False)
            print('feature for user ' + str(i) + ' is: ' + str(is_open))
      # highlight-end
~~~
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~js title="demo.js"
const fpClient = new featureProbe.FeatureProbe({
  remoteUrl: FEATURE_PROBE_SERVER_URL,
  serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,
  refreshInterval: 5000,
});

// highlight-start
for(let i = 0; i < 100; i++) {
  const user = new featureProbe.FPUser();
  const isOpen = fpClient.booleanValue(YOUR_TOGGLE_KEY, user, false);
  console.log("feature for user " + i + " is :" + isOpen);
}
// highlight-end

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

### Validate result
From the command line log, we can see that about 10% of the users entered the toggle, that is, they got the return variation value true.
<details>
  <summary>log example</summary>

~~~bash
feature for user 0 is :false
# highlight-next-line
feature for user 1 is :true
feature for user 2 is :false
feature for user 3 is :false
feature for user 4 is :false
feature for user 5 is :false
feature for user 6 is :false
feature for user 7 is :false
feature for user 8 is :false
feature for user 9 is :false
feature for user 10 is :false
# highlight-next-line
feature for user 11 is :true
feature for user 12 is :false
feature for user 13 is :false
feature for user 14 is :false
feature for user 15 is :false
feature for user 16 is :false
feature for user 17 is :false
feature for user 18 is :false
feature for user 19 is :false
feature for user 20 is :false
~~~

</details>

:::tip
Every time the program is run, the user who enters the toggle may be different. If users with the same id always get the same toggle result, you need to [use FPUser's stableRollout interface](stable_rollout_tutorial.md).
:::

You can go back to the toggle targeting page of the platform, adjust the percentage, and then re-run the server program to see if the ratio of entering the toggle in the log has changed.

## Control the front-end program

We provide a front-end js code example, and you can start to experience how the front-end code uses toggles.

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
const fpClient = new featureProbe.FeatureProbe({
  // highlight-start
  remoteUrl: "https://featureprobe.io/server",
  clientSdkKey: // Paste client sdk key here,
  // highlight-end
  user,
  refreshInterval: 5000,
});
~~~

4. Simulate the current user accessing the toggle `tutorial_rollout` and get the toggle status directly

~~~js title="example/index.html"
<script>
  // highlight-next-line
  const user = new featureProbe.FPUser();
  const fpClient = new featureProbe.FeatureProbe({
    remoteUrl: "https://featureprobe.io/server",
    clientSdkKey: // Paste client sdk key here,
    user,
    refreshInterval: 5000,
  });
  
  fpClient.start();
  fpClient.on("ready", function() {
    // highlight-start
    const boolValue = fpClient. boolValue("tutorial_rollout", false);
    document.getElementById("boolean-result").innerText = boolValue;
    // highlight-end
  });
</script>
~~~

### Validate result

Open `index.html` in the browser, manually refresh the page (simulating multiple visits by the user), and you can see that the page can get the return value of `true` or `false` according to the configured percentage.

<details>
<summary>Demo</summary>
<Tabs>
<TabItem value="true" label="True" default>

~~~
FeatureProbe JS SDK demo
This is a simple front-end-only application using FeatureProbe JS SDK.

boolean type
FeatureProbe evaluation boolean type toggle result is : true
~~~
</TabItem>
<TabItem value="false" label="False" >

~~~
FeatureProbe JS SDK demo
This is a simple front-end-only application using FeatureProbe JS SDK.

boolean type
FeatureProbe evaluation boolean type toggle result is : false
~~~
</TabItem>
</Tabs>
</details>

You can go back to the toggle targeting page of the platform, adjust the percentage, and then refresh the page to see if the obtained `true`/`false` has changed.

:::tip
If you want the same user, no matter how he refreshes, he will always get a stable value. You need to [Stable Rollout](stable_rollout_tutorial.md), and pass in the user's unique ID.
:::
