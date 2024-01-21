---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Stable rollout

In most cases, we hope that in the process of gradual rollout , once a specific user enters a variation, he will always enter the variation without reducing the percentage.
We don't want users to be confused when they see new features and sometimes they don't because of refreshing the page, re-opening the app, requesting to be assigned to another server instance, etc.
We call this application scenario "Stable Rollout".

Below we introduce how to use the FeatureProbe SDK to achieve a stable rollout effect.

## Create a toggle on platform

Here we reuse the `tutorial_rollout` toggle, refer to [here](index.md#create-a-toggle-on-the-platform) for the creation process.

## Write code {#backend-code}

1. Refer to [here](index.md#backend-code) steps 1-4 to prepare the backend code environment.
2. Pass the user's unique ID (assuming a total of 100 users in the following example, id ranges from 0 to 99) to the FeatureProbe SDK through the `stableRollout` function

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

        for (Integer i = 0; i < 100; i++) {
        // highlight-start
            FPUser user = new FPUser().stableRollout(i.toString());
        // highlight-end
            Boolean isOpen = fpClient.boolValue("tutorial_rollout", user, false);
            System.out.println("feature for user " + i + " is :" + isOpen);
        }
        fpClient.close();
    }
~~~

</TabItem>
<TabItem value="golang" label="Go">

~~~go title="example/main.go"
func main() {
	config := featureprobe.FPConfig{
		RemoteUrl: "https://featureprobe.io/server",
		ServerSdkKey:    // 填入 服务端SDK密钥,
		RefreshInterval: 5000, // ms
		WaitFirstResp:   true,
	}
	fp, err := featureprobe.NewFeatureProbe(config)
	if err != nil {
		fmt.Println(err)
		return
	}
	for i:=0; i<100; i++  {
    // highlight-start
		user := featureprobe.NewUser().StableRollout(strconv.Itoa(i))
	// highlight-end
		detail := fp.BoolValue("tutorial_rollout", user, false)
		fmt.Println("feature for user", i, "is:", detail)
	}
	fp.Close()
}
~~~
</TabItem>
<TabItem value="rust" label="Rust">

~~~rust title="examples/demo.rs"
#[tokio::main]
async fn main() {
    let remote_url = "https://featureprobe.io/server";
    let server_sdk_key = // 填入 服务端SDK密钥;
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
    for n in 1..100 {
  // highlight-start
        let user = FPUser::new().stable_rollout(n.to_string());
  // highlight-end
        let enable = fp.bool_value("tutorial_rollout", &user, false);
        println!("feature for user {:?} is: {:?}", n, enable);
    }
    fp.close();
}
~~~
</TabItem>
<TabItem value="python" label="Python">

~~~python title="demo.py"
logging.basicConfig(level=logging.WARNING)

if __name__ == '__main__':
    FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server'
    FEATURE_PROBE_SERVER_SDK_KEY = # 填入 服务端SDK密钥;

    config = fp.Config(remote_uri=FEATURE_PROBE_SERVER_URL,  # FeatureProbe server URL
                       sync_mode='polling',
                       refresh_interval=3)

    with fp.Client(FEATURE_PROBE_SERVER_SDK_KEY, config) as client:
        for i in range(100):
      # highlight-start
            user = fp.User().stable_rollout(str(i))
      # highlight-end
            is_open = client.value('tutorial_rollout', user, default=False)
            print('feature for user ' + str(i) + ' is: ' + str(is_open))
~~~
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~js title="demo.js"
const FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server';
const FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key

const fpClient = new featureProbe.FeatureProbe({
  remoteUrl: FEATURE_PROBE_SERVER_URL,
  serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,
  refreshInterval: 5000,
});

for(let i = 0; i < 100; i++) {
// highlight-start
  const user = new featureProbe.FPUser().stableRollout(i.toString());
// highlight-end
  const isOpen = fpClient.booleanValue(YOUR_TOGGLE_KEY, user, false);
  console.log("feature for user " + i + " is :" + isOpen);
}
~~~
</TabItem>
</Tabs>

3. Run the program

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

## Validate result

1. From the command line log, it can be seen that about 10% of users have entered the toggle, and no matter how many times they are run (even using different language SDKs), users with the same id (for example: 13, 15, 16) get true.

<details>
  <summary>Log example of percentage 10%</summary>

~~~bash
feature for user 0 is :false
feature for user 1 is :false
feature for user 2 is :false
feature for user 3 is :false
feature for user 4 is :false
feature for user 5 is :false
feature for user 6 is :false
feature for user 7 is :false
feature for user 8 is :false
feature for user 9 is :false
feature for user 10 is :false
feature for user 11 is :false
feature for user 12 is :false
# highlight-next-line
feature for user 13 is :true
feature for user 14 is :false
# highlight-next-line
feature for user 15 is :true
# highlight-next-line
feature for user 16 is :true
feature for user 17 is :false
feature for user 18 is :false
feature for user 19 is :false
feature for user 20 is :false
~~~

</details>

2. Increases the percentage to 50% on platform, you can see that 50% of the users get true, and users who got true before (such as id: 13, 15, 16) still get true.

<details>
  <summary>Log example of percentage 50%</summary>

~~~bash
feature for user 0 is: false
feature for user 1 is: false
feature for user 2 is: false
feature for user 3 is: false
feature for user 4 is: true
feature for user 5 is: true
feature for user 6 is: false
feature for user 7 is: false
feature for user 8 is: false
feature for user 9 is: false
feature for user 10 is: false
feature for user 11 is: false
feature for user 12 is: false
# highlight-next-line
feature for user 13 is: true
feature for user 14 is: true
# highlight-next-line
feature for user 15 is: true
# highlight-next-line
feature for user 16 is: true
feature for user 17 is: true
feature for user 18 is: false
feature for user 19 is: false
~~~

</details>
