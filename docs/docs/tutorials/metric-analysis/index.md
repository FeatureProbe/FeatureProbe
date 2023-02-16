---
sidebar_position: 7
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 使用自定义事件上报


我们将带领你使用FeatureProbe的平台的指标分析功能。通过编写后端/前端程序，使用SDK实现 `自定义事件` 的数据上报，并在平台上查看分析的结果。


## 在平台上创建开关
1. 登录我们提供的FeatureProbe[演示平台](https://featureprobe.io)，如果是第一次登录，请输入邮箱。后续可以继续使用你的邮箱访问到属于你的数据。
2. 点击`+开关`新建一个开关
![add](/tutorial_create_toggle_button_cn.png)
3. 名字和标识都设置为`custom_event`，点击`创建并发布`
![create](/tutorial_metric_analysis_create_cn.png)
4. 从开关列表中点击`custom_event`，打开设置详情页
![list](/tutorial_metric_analysis_list_click_cn.png)
5. 将状态设置为`生效`，默认规则的返回值更改为按`百分比放量`，并设置50%为variation1，50%设置为variation2
![list](/tutorial_metric_analysis_targeting_cn.png)
6. 点击下方的`发布`按钮，并`确认`变更
![list](/tutorial_metric_analysis_targeting_confirm_cn.png)




## 配置指标并开始收集数据
1. 打开`指标分析`板块，选择`自定义事件`下的`转化率`指标，指标名配置为`test_event`，点击`保存`
![list](/tutorial_metric_analysis_save_cn.png)

2. 指标保存成功后，点击`收集数据`按钮，开始收集数据
![list](/tutorial_metric_analysis_start_cn.png)

## 编写后端程序
我们提供一个后端的代码示例，你可以从这里开始体验后端代码如何上报自定义事件。

### 编写代码 {#backend-code}

1. According to the language you are familiar with, download and open the corresponding back-end sample code.

<Tabs groupId="language">
<TabItem value="java" label="Java" default>

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-java.git
cd server-sdk-java
~~~
Open `src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java` file with an editor.

</TabItem>

<!-- 

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

-->

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

<!-- 

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

-->

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

<!-- 

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
        #[cfg(feature = "use_tokio")]
        http_client: None,
        wait_first_resp: true,
        ..Default::default()
    };

    let fp = match FeatureProbe::new(config) {
        Ok(fp) => fp,
        Err(e) => {
            tracing::error!("{:?}", e);
            return;
        }
    };
  
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
                       sync_mode='pooling',
                       refresh_interval=3)

    with fp.Client(FEATURE_PROBE_SERVER_SDK_KEY, config) as client:
     
~~~
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~js title="demo.js"
const fpClient = new featureProbe.FeatureProbe({
  remoteUrl: FEATURE_PROBE_SERVER_URL,
  serverSdkKey: FEATURE_PROBE_SERVER_SDK_KEY,
  refreshInterval: 5000,
});

~~~
</TabItem>

-->

</Tabs>

6. Run the program.

<Tabs groupId="language">
  <TabItem value="java" label="Java" default>

  ~~~bash
  mvn package
  java -jar ./target/server-sdk-java-1.4.0.jar
  ~~~
  </TabItem>

<!-- 
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
 -->
</Tabs>


## 编写前端程序

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
const fpClient = new featureProbe. FeatureProbe({
  // highlight-start
  remoteUrl: "https://featureprobe.io/server",
  clientSdkKey: // Paste client sdk key here,
  // highlight-end
  user,
  refreshInterval: 5000,
});
~~~

5. Add the following code. Simulate 1000 users accessing the toggle. Among the users whose toggle return value is `true`, 55% of them report custom events, and among users whose toggle return value is `false`, 45% of them report custom events.

~~~js title="example/index.html"
<script>
  const user = new featureProbe.FPUser();
  const fpClient = new featureProbe.FeatureProbe({
    remoteUrl: "https://featureprobe.io/server",
    clientSdkKey: // Paste client sdk key here,
    user,
    refreshInterval: 5000,
  });
  
  fpClient.start();

  fpClient.waitUntilReady().then(() => {
    // highlight-start
    const boolValue = fpClient. boolValue("tutorial_rollout", false);
    // highlight-end
  })
    
</script>
~~~




