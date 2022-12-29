---
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 用户稳定进入灰度组

大部分情况下，我们希望在一个功能的灰度放量过程中，某个特定用户一旦进入了灰度放量组，在灰度比例不减少的情况下，总是进入灰度组。
不希望用户因为刷新页面、重新打开APP、请求被分配到另一个服务端实例等原因，一会看到新功能，一会看不到新功能，从而感到迷惑。
这种应用场景我们称之为『用户稳定进入灰度组』。

以下我们介绍如何使用 FeatureProbe SDK 以达到稳定进组的效果。

## 平台创建开关

这里我们复用 `tutorial_rollout` 开关，创建过程参考[这里](index.md#在平台创建开关)

## 编写后端代码

1. 参考[这里](index.md#backend-code) 1-4 步，准备后端代码环境。
2. 将用户唯一ID（以下例子中假设共100个用户，id为0-99），通过 `stableRollout` 函数传入FeatureProbe SDK

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
                       sync_mode='pooling',
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
</Tabs>

3. 运行编辑后的服务端程序

<Tabs groupId="language">
   <TabItem value="java" label="Java" default>

~~~bash
bash:> mvn package
bash:> java -jar ./target/server-sdk-java-1.4.0.jar
~~~
</TabItem>
<TabItem value="golang" label="Go">

~~~bash
bash:> go run example/main.go
~~~
</TabItem>
<TabItem value="rust" label="Rust">

~~~bash
bash:> cargo run --example demo
~~~
</TabItem>
<TabItem value="python" label="Python">

~~~bash
bash:> pip3 install -r requirements.txt
bash:> python3 demo.py
~~~
</TabItem>
</Tabs>

## 验证结果

1. 从命令行log可以看到，有大约10%的用户进入了开关，且不论运行多少次（甚至是使用不同语言SDK），都是相同id（例如：13，15，16）的用户拿到了true。

<details>
  <summary>10% 放量的log示例</summary>

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

2. 平台上调大放量比例到50%，可以看到50%用户拿到了true，且之前拿到true的用户（例如id：13，15，16）仍然拿到了true。

<details>
  <summary>50% 放量的log示例</summary>

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