---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Use segment

Commonly used target rules can be set up as segment, which can be shared between toggles.

We'll guide you to use FeatureProbe's platform to create a segment and then use the segment in two toggles. And through a back-end program, the modification of the segment will take effect in the two toggles at the same time.

Suppose we want to implement the following scenario:
* There is a whitelist of QAs emails that needs to be used in multiple toggles. so that QAs can test multiple toggles.
* This whitelist of QAs needs to be modified uniformly, and the new QA added can take effect in multiple toggles.

## Create a segment on the platform

1. Log in to the FeatureProbe [demo platform](https://featureprobe.io). If you log in for the first time, please enter your email address. You can continue to use your email to access your data in the future.
2. Click `Segments/+Segment` to create a new segment.

![create segment](/tutorial_create_segment_en.png)

3. Fill in the name and key, click `Create and publish`.

![publish segment](/tutorial_publish_segment_en.png)

4. Click the newly created segment from the list to enter editing.

![segment_list_cn.png](/tutorial_segment_list_en.png)

5. Add a rule, select the type, enter the attribute `email`,
* Select `string` type
* Select `is one of` operator
* Then enter the emails of the two QAs
* Click `Publish`

![tutorial_segment_detail_en.png](/tutorial_segment_detail_en.png)

6. There is no toggle to use this "segment", click "next" and "confirm" to change.

![tutorial_segment_publish_next_step_en.png](/tutorial_segment_publish_next_step_en.png)

## Use segment in toggle

Next, we come to `Toggles` list, create two toggles using the segment `qa_email` created above.

1. Create a toggle `feature1` with a return variation value of boolean type, use the default configuration, and then click `Create and publish`.

![tutorial_toggle_create_use_segment_en.png](/tutorial_toggle_create_use_segment_en.png)

2. Enter the targeting page of the toggle `feature1`, change the status to `enabled`, click `+ Add Rule`, and select the `segment` type.

![tutorial_toggle_use_segment_add_rule_en.png](/tutorial_toggle_use_segment_add_rule_en.png)

3. Edit rules
* Select `is in segments`
* Select the `QA Email` segment
* Set the return variation value `variation2` for the segment
* Other return rules set the return variation value `variation1`

![tutorial_toggle_use_segment_rule_detail_en.png](/tutorial_toggle_use_segment_rule_detail_en.png)

4. Publish toggle `feature1`.
5. Repeat steps 1-4 above to create another toggle `feature2` using the same segment.

## Validate segment

### Backend code writing

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
Open `example/main.go` file with an editor.
</TabItem>
<TabItem value="rust" label="Rust">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-rust.git
cd server-sdk-rust
~~~
Open `examples/demo.rs` file with an editor.

</TabItem>
<TabItem value="python" label="Python">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-python.git
cd server-sdk-python
~~~
Open `demo.py` file with an editor.

</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-node.git
cd server-sdk-node
~~~
Open `example/demo.js` file with an editor.

</TabItem>
</Tabs>

2. Open the FeatureProbe platform [project list page](https://featureprobe.io/projects), you can click `Projects` on the toggle details page to open
    ![project](/tutorial_click_project_en.png)
3. Copy `Server SDK Key`
    ![sdk key](/tutorial_rollout_server_sdk_key_en.png)
4. Fill in `Server SDK Key` and `FeatureProbe remote URL` ("https://featureprobe.io/server") into the corresponding variables of the backend code

<Tabs groupId="language">
<TabItem value="java" label="Java" default>

~~~java  title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
private static final String FEATURE_PROBE_SERVER_URL = "https://featureprobe.io/server";
private static final String FEATURE_PROBE_SERVER_SDK_KEY = // 填入 服务端SDK密钥 ;
~~~
</TabItem>
<TabItem value="golang" label="Go">

~~~go title="example/main.go"
config := featureprobe.FPConfig{
    // highlight-start
    RemoteUrl: "https://featureprobe.io/server",
    ServerSdkKey:    // 填入 服务端SDK密钥
    // highlight-end
    RefreshInterval: 5000, // ms
    WaitFirstResp:   true,
}
~~~
</TabItem>
<TabItem value="rust" label="Rust">

~~~rust title="examples/demo.rs"
let remote_url = "https://featureprobe.io/server";
let server_sdk_key = // 填入 服务端SDK密钥
~~~
</TabItem>
<TabItem value="python" label="Python">

~~~python title="demo.py"
FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server'
FEATURE_PROBE_SERVER_SDK_KEY = # 填入 服务端SDK密钥
~~~
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~js title="demo.js"
const FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server';
const FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key
~~~
</TabItem>
</Tabs>

5. Add the following code to simulate three users with email attributes accessing these 2 toggles.

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
         new FPUser().with("email", "tester_a@company.com"),
         new FPUser().with("email", "tester_b@company.com"),
         new FPUser().with("email", "tester_c@company.com"),
      };

      for (FPUser user:users) {
         if (fpClient.boolValue("feature1", user, false)) {
            System.out.println(user.getAttr("email") + " see the new feature1");
         } else {
            System.out.println(user.getAttr("email") + " see nothing");
         }
      }

      for (FPUser user:users) {
         if (fpClient.boolValue("feature2", user, false)) {
            System.out.println(user.getAttr("email") + " see the new feature2");
         } else {
            System.out.println(user.getAttr("email") + " see nothing");
         }        
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
		ServerSdkKey:    // Fill in the server SDK key,
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
		featureprobe.NewUser().With("email", "tester_a@company.com"),
		featureprobe.NewUser().With("email", "tester_b@company.com"),
		featureprobe.NewUser().With("email", "tester_c@company.com"),
	}

	for _, user := range users {
		if (fp.BoolValue("feature1", user, false)) {
		    fmt.Println(user.Get("email"), "see the new feature1")
		} else {
		    fmt.Println(user.Get("email"), "see nothing")
		}
	}
	
	for _, user := range users {
		if (fp.BoolValue("feature2", user, false)) {
		    fmt.Println(user.Get("email"), "see the new feature2")
		} else {
		    fmt.Println(user.Get("email"), "see nothing")
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
        FPUser::new().with("email", "tester_a@company.com"),
        FPUser::new().with("email", "tester_b@company.com"),
        FPUser::new().with("email", "tester_c@company.com")
    ];
    for user in users {
        if fp.bool_value("feature1", &user, false) {
           println!("{:?} see the new feature1", user.get("email"));
        } else {
           println!("{:?} see nothing", user.get("email"));
        }
    }
    for user in users {
        if fp.bool_value("feature2", &user, false) {
            println!("{:?} see the new feature2", user.get("email"));
        } else {
            println!("{:?} see nothing", user.get("email"));
        }
    }
    // highlight-end
    fp.close();
}
~~~
</TabItem>
<TabItem value="python" label="Python">

```python title="demo.py"
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
            fp.User().with_attr("email", "tester_a@company.com"),
            fp.User().with_attr("email", "tester_b@company.com"),
            fp.User().with_attr("email", "tester_c@company.com")
        ]

        for user in users:
            if client.value('feature1', user, default=False):
                print(user['email'] + 'see the new feature1')
            else:
                print(user['email'] + 'see nothing')

        for user in users:
            if client.value('feature2', user, default=False):
                print(user['email'] + 'see the new feature2')
            else:
                print(user['email'] + 'see nothing')
        # highlight-end

```
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
    new featureProbe.FPUser().with("email", "tester_a@company.com"),
    new featureProbe.FPUser().with("email", "tester_b@company.com"),
    new featureProbe.FPUser().with("email", "tester_c@company.com"),
];

for(let i = 0; i < users.length; i++) {
  if (fpClient.booleanValue("feature1", users[i], false)) {
    console.log(users[i].get("email") + ' see the new feature1');
  } else {
    console.log(users[i].get("email") + ' see nothing');
  }
}

for(let i = 0; i < users.length; i++) {
  if (fpClient.booleanValue("feature2", users[i], false)) {
    console.log(users[i].get("email") + ' see the new feature2');
  } else {
    console.log(users[i].get("email") + ' see nothing');
  }
}
// highlight-end
~~~
</TabItem>
</Tabs>

:::tip
In addition to the user attributes explicitly used in the rules of toggle, which need to be passed to the SDK through the with method, the user attributes (for example: email) that need to be used in the segment used in toggle also need to be passed to the FeatureProbe SDK through the with method.
:::

### Run the code

Run the program.

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
node example/demo.js
~~~
</TabItem>
</Tabs>

Check the log verification results, you can see that the two test emails (tester_a and tester_b) in the segment can see the two new features, but the email (tester_c) not in the segment cannot see them.

~~~bash
tester_a@company.com see the new feature1
tester_b@company.com see the new feature1
tester_c@company.com see nothing
tester_a@company.com see the new feature2
tester_b@company.com see the new feature2
tester_c@company.com see nothing
~~~

## Update segment

Next, let's update the rules of the segment, and then verify that the updated results can take effect on the two toggles at the same time.

### Update segments on the page

1. Enter the edit page of the segment `qa_email`.
2. Delete email account `test_b` and add email account `test_c`.

![tutorial_segment_after_update_en.png](/tutorial_segment_after_update_en.png)

3. Publish segment.

### Rerun the program to see the result

Run the program again according to the above [operation method](##run-the-code) to view the log

~~~bash
tester_a@company.com see the new feature1
tester_b@company.com see nothing
tester_c@company.com see the new feature1
tester_a@company.com see the new feature2
tester_b@company.com see nothing
tester_c@company.com see the new feature2
~~~

You can see that the modification has taken effect on both toggles.