---
sidebar_position: 7
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 使用指标分析

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
1. 打开`指标分析`板块，输入指标名称为`Click Button Conversion`，选择指标类型为`转化类`， 在事件模块选择事件类型为`自定义`，输入事件名为`test_event`，胜出标准为`越高越好`，最后点击`保存`
![list](/tutorial_metric_analysis_save_cn.png)

2. 指标保存成功后，点击`收集数据`按钮，开始收集数据
![list](/tutorial_metric_analysis_start_cn.png)

## 编写后端程序
我们提供一个后端的代码示例，你可以从这里开始体验后端代码如何上报自定义事件。

### 编写代码 {#backend-code}

1. 按你熟悉的语言，下载并打开相应的后端示例代码

<Tabs groupId="language">
<TabItem value="java" label="Java" default>

~~~bash
git clone https://gitee.com/FeatureProbe/server-sdk-java.git
cd server-sdk-java
~~~
用编辑器打开`src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java`文件。

</TabItem>

<TabItem value="golang" label="Go">

~~~bash
git clone https://gitee.com/FeatureProbe/server-sdk-go.git
cd server-sdk-go
~~~
Open the `example/main.go` file with an editor.
</TabItem>
<TabItem value="rust" label="Rust">

~~~bash
git clone https://gitee.com/FeatureProbe/server-sdk-rust.git
cd server-sdk-rust
~~~
Open the `examples/demo.rs` file with an editor.
</TabItem>
<TabItem value="python" label="Python">

~~~bash
git clone https://gitee.com/FeatureProbe/server-sdk-python.git
cd server-sdk-python
~~~
Open the `demo.py` file with an editor.
</TabItem>
<TabItem value="nodejs" label="Node.js">

~~~bash
git clone https://gitee.com/FeatureProbe/server-sdk-node.git
cd server-sdk-node
~~~
Open the `examples/demo.js` file with an editor.
</TabItem>

</Tabs>

2. 打开FeatureProbe平台[项目列表页面](https://featureprobe.io/projects)， 可以在开关详情页点击`项目`来打开
![project](/tutorial_click_project_cn.png)

3. 复制`服务端SDK密钥`
![sdk key](/tutorial_rollout_server_sdk_key_cn.png)

4. 将`服务端SDK密钥`以及`FeatureProbe网址` ("https://featureprobe.io/server") 填入后端代码相应变量中

<Tabs groupId="language">
<TabItem value="java" label="Java" default>

~~~java title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
    private static final String FEATURE_PROBE_SERVER_URL = "https://featureprobe.io/server";
    private static final String FEATURE_PROBE_SERVER_SDK_KEY = // 填入 服务端SDK密钥SDK key
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

5. 加入以下代码，模拟1000个用户访问开关。开关返回值为`true`（variation2）的用户中，有55%的用户发生了转化（例如点击了某个button）因此上了报自定义事件（点击事件），开关返回值为`false`的用户中，有45%的用户完成了转化，上报自定义事件。
注意，以下的代码只是生成随机数模拟概率，并没有实际的业务代码。实际中这里可能是true的时候跟用户展示新设计的页面，有55%的用户会点击上面的按钮。而false的时候，给用户展示旧的页面，有45%的用户点击了上面的按钮。

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

6. 运行编辑后的服务端程序

<Tabs groupId="language">
  <TabItem value="java" label="Java" default>

  ~~~bash
  mvn package
  java -jar ./target/server-sdk-java-2.0.1.jar
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


## 编写前端程序

我们提供一个前端的js代码示例，你可以从这里开始体验前端代码如何上报自定义事件。

### 编写代码 {#frontend-code}

1. 下载示例代码

~~~bash
git clone https://gitee.com/FeatureProbe/client-sdk-js.git
cd client-sdk-js
~~~

2. 打开[平台](https://featureprobe.io/projects)获取client sdk key
:::info
点击『项目』Tab，可以进入『项目』列表，获取各类SDK key，以及修改项目和环境信息。
:::

![client sdk key](/tutorial_client_sdk_key_cn.png)

3. 打开 `example/index.html` 填入 `客户端SDK密钥` 以及 `FeatureProbe网址`  ("https://featureprobe.io/server")

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

4. 加入以下代码，通过页面刷新的方式模拟很多用户访问开关。开关返回variation2，值为`true`的用户中，有55%的用户转化，开关返回variation1，值为`false`的用户中，有45%的用户转化。

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
        fpClient.track(YOUR_EVENT_NAME, user.getKey());
      }
    } else {
      if (random > 55) {
        fpClient.track(YOUR_EVENT_NAME, user.getKey());
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

## 验证结果

重新打开平台的`指标分析`板块查看数据结果。
![result](/tutorial_metric_analysis_result_cn.png)
