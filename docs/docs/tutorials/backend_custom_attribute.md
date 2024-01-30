---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Show different information to different users

We'll guide you to use FeatureProbe platform to create a custom feature-controlled toggle. Then we write a back-end program to verify that the back-end program requests the FeatureProbe SDK with different user information, and will get different results.

Suppose we want to implement the following scenario:

* For "VIP" users of "Shanghai", it will display "Welcome VIP customers from Shanghai"
* For "Beijing" users (without distinguishing levels), display "Welcome customers from Beijing"
* For users who do not meet the above two conditions, display "Welcome"

1. Log in to the FeatureProbe [demo platform](https://featureprobe.io). If you log in for the first time, please enter your email address. You can continue to use your email to access your data in the future.
2. Click `+Toggle` to create a new toggle.
* Fill in the name and key.
* Select the string type as the return variation type.
* Add three variations, fill in the name and value respectively, the value is the three different prompts we want to return.
* Select a variation when toggle is disabled.
* Click `Create and publish`.

![create toggle](/tutorial_variation_create_en.png)

3. Click to enter the targeting page of the newly created tutorial_variation toggle

* Click + Add rule to add a new rule
* Add two conditions to the rules, the city is shanghai, and the rank is VIP
* The return value is selected as variation1 (that is, the value is: welcome VIP customers from Shanghai)

![rule one](/tutorial_variation_rule1_en.png)

* Click `+ Add Rule` again
* Add a condition to the rule, the city is Beijing, and the return variation is selected as variation2

![rule two](/tutorial_variation_rule2_en.png)

* The return variation when no rules is matched is selected as variation3

![default](/tutorial_variation_default_rule_en.png)

* Change the toggle status to `enabled`, click `publish` below
 
![publish](/tutorial_variation_publish_en.png)

* Click `Confirm` to release the toggle.

![confirm](/tutorial_variation_confirm_en.png)

4. At this point, you should see the prompt of `Published successfully`

![publish success](/tutorial_variation_publish_success_en.png)

The operation on the platform is over here, the toggle has been successfully created and can be accessed. Below we introduce how to get these variation values by SDK.

## Control the back-end program

We provide a backend code example, from which you can start to experience how the backend code uses the toggle.

### Write code

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
Open the `example/demo.js` file with an editor.
</TabItem>
</Tabs>

2. Open the FeatureProbe platform [projects page](https://featureprobe.io/projects), you can click `Projects` on the toggle targeting page to open: ![project](/tutorial_click_project_en.png)

3. Copy `Server SDK Key` ![sdk key](/tutorial_rollout_server_sdk_key_en.png)

4. Fill in `Server SDK Key` and `FeatureProbe remote URL` ("https://featureprobe.io/server") into the corresponding variables of the backend code

<Tabs groupId="language">
   <TabItem value="java" label="Java" default>

~~~java  title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
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

5. Add the following code to simulate five users accessing this toggle
    1. VIP users from Shanghai
    2. Gold users form Shanghai
    3. VIP users form Beijing
    4. Gold users form Beijing
    5. VIP users form Tianjin

<Tabs groupId="language">
   <TabItem value="java" label="Java" default>

~~~java  title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
    public static void main(String[] args) throws IOException {

        Logger root = (Logger)LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME);
        root.setLevel(Level.WARN);

        final FPConfig config = FPConfig.builder()
            .remoteUri(FEATURE_PROBE_SERVER_URL)
            .build();

        // Init FeatureProbe, share this FeatureProbe instance in your project.
        final FeatureProbe fpClient = new FeatureProbe(FEATURE_PROBE_SERVER_SDK_KEY, config);
        
        // highlight-start
        FPUser[] users = {
            new FPUser().with("city", "Shanghai").with("rank", "VIP"),
            new FPUser().with("city", "Shanghai").with("rank", "Gold"),
            new FPUser().with("city", "Beijing").with("rank", "VIP"),
            new FPUser().with("city", "Beijing").with("rank", "Gold"),
            new FPUser().with("city", "Tianjin").with("rank", "VIP"),
        };
    
        for (FPUser user:users) {
            String greeting = fpClient.stringValue("tutorial_variation", user, "Welcome");
            System.out.println(greeting);
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
	users := []featureprobe.FPUser{
		featureprobe.NewUser().With("city", "Shanghai").With("rank", "VIP"),
		featureprobe.NewUser().With("city", "Shanghai").With("rank", "Gold"),
		featureprobe.NewUser().With("city", "Beijing").With("rank", "VIP"),
		featureprobe.NewUser().With("city", "Beijing").With("rank", "Gold"),
		featureprobe.NewUser().With("city", "Tianjin").With("rank", "VIP"),
	}

	for _, user := range users {
		greeting := fp.StrValue("tutorial_variation", user, "Welcome")
		fmt.Println(greeting)
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
    let users = [
        FPUser::new().with("city", "Shanghai").with("rank", "VIP"),
        FPUser::new().with("city", "Shanghai").with("rank", "Gold"),
        FPUser::new().with("city", "Beijing").with("rank", "VIP"),
        FPUser::new().with("city", "Beijing").with("rank", "Gold"),
        FPUser::new().with("city", "Tianjin").with("rank", "VIP")
    ];
    for user in users {
        let greeting = fp.string_value("tutorial_variation", &user, "Welcome".to_string());
        println!("{:?}", greeting);
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
      users = [
         fp.User().with_attr("city", "Shanghai").with_attr("rank", "VIP"),
         fp.User().with_attr("city", "Shanghai").with_attr("rank", "Gold"),
         fp.User().with_attr("city", "Beijing").with_attr("rank", "VIP"),
         fp.User().with_attr("city", "Beijing").with_attr("rank", "Gold"),
         fp.User().with_attr("city", "Tianjin").with_attr("rank", "VIP")
      ]
      for user in users:
        greeting = client.value('tutorial_variation', user, default="Welcome")
        print(greeting)
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
const users = [
    new featureProbe.FPUser().with("city", "Shanghai").with("rank", "VIP"),
    new featureProbe.FPUser().with("city", "Shanghai").with("rank", "Gold"),
    new featureProbe.FPUser().with("city", "Beijing").with("rank", "VIP"),
    new featureProbe.FPUser().with("city", "Beijing").with("rank", "Gold"),
    new featureProbe.FPUser().with("city", "Tianjin").with("rank", "VIP"),
];

for(let i = 0; i < users.length; i++) {
  const greeting = fpClient.stringValue("tutorial_variation", users[i], "Welcome");
  console.log(greeting);
}
// highlight-end

~~~
</TabItem>
</Tabs>

:::tip
The user's attributes (for example: city, rank) need to be obtained by the developer in the business code in other ways, and then passed to the FeatureProbe SDK through the with method. The SDK is only responsible for applying rules to these users, The SDK cannot infer the user's attributes internally by itself.
:::

6. Run the program

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
As can be seen from the command line log, for the following five test users:

> 1. VIP users from Shanghai
> 2. Gold users form Shanghai
> 3. VIP users form Beijing
> 4. Gold users form Beijing
> 5. VIP users form Tianjin

apply rules

> * For "VIP" users of "Shanghai", it will display "Welcome VIP customers from Shanghai"
> * For "Beijing" users (without distinguishing levels), display "Welcome customers from Beijing"
> * For users who do not meet the above two conditions, display "Welcome"

After that, the following results were obtained:

~~~bash
Welcome VIP customers from Shanghai
welcome
Welcome customers from Beijing
Welcome customers from Beijing
welcome
~~~

You can change the code, try more combinations of user attributes, and see if the results displayed in the log meet the conditions.

## Control the front-end program

We provide a front-end js code example, and you can start to experience how the front-end code uses toggles from here.

### Write code

1. Download the sample code

~~~bash
git clone https://github.com/FeatureProbe/client-sdk-js.git
cd client-sdk-js
~~~

2. Open [platform](https://featureprobe.io/projects) to get client sdk key

:::info
Click the "Projects" tab to enter the "Projects" list, obtain various SDK keys, and modify project and environment information.
:::
![client sdk key](/tutorial_client_sdk_key_cn.png)

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

4. Simulate the "VIP" user from "Shanghai" to access the toggle `tutorial_variation` and get the toggle result directly

~~~js title="example/index.html"
<script>
    // highlight-next-line
    const user = new featureProbe.FPUser().with("city", "Shanghai").with("rank", "VIP");

    const fpClient = new featureProbe. FeatureProbe({
        remoteUrl: "https://featureprobe.io/server",
        clientSdkKey: // Paste client sdk key here,
        user,
        refreshInterval: 5000,
    });

    fpClient.start();
    fpClient.on("ready", function() {
        // highlight-start
        const stringValue = fpClient.stringValue("tutorial_variation", "Welcome");
        document.getElementById("string-result").innerText = stringValue;
        // highlight-end
    });
</script>
~~~

### Validate result

Open `index.html` in the browser, and you can see that for the current "Welcome VIP customers from Shanghai".

~~~
string type
FeatureProbe evaluation string type toggle result is : Welcome VIP customers from Shanghai
~~~

You can go back to the `index.html` file and update the `with` parameter to see the difference in the return variation value.

~~~ js title="example/index.html"
const user = new featureProbe.FPUser().with("city", "Beijing").with("rank", "VIP");
~~~
