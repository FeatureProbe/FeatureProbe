---
sidebar_position: 3
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 按百分比灰度放量

我们将带领你使用FeatureProbe的平台，控制一个后端程序，让后端程序对接收到的用户请求，按百分比展示新功能。

## 在平台创建开关

1. 登录我们提供的FeatureProbe[演示平台](https://featureprobe.io)，如果是第一次登录，请输入邮箱。后续可以继续使用你的邮箱访问到属于你的数据。
2. 点击`+开关`新建一个开关
![add](/tutorial_create_toggle_button_cn.png)
3. 名字和标识都设置为`tutorial_rollout`，点击`创建`
![create](/tutorial_rollout_create_cn.png)
7. 从开关列表中点击`tutorial_rollout`，打开设置详情页
![list](/tutorial_list_click_cn.png)
8. 将默认规则的返回值更改为`按百分比放量`
![return](/tutorial_return_percentage_cn.png)
9. 设置 10% 打开开关（返回true）， 90% 关闭开关（返回false）, 状态设置为 `生效`
![10% true](/tutorial_rollout_enable_cn.png)
10. 点击下方`发布`按钮，并`确认`变更
![confirm](/tutorial_rollout_confirm_cn.png)

此时平台上就操作就完成了，我们创建了一个管理灰度发布的开关，下面我们要在程序中使用它，看看实际效果。

:::tip
开关创建后，可以在后端程序中访问，也可以在前端程序中访问，以下我们分别介绍如何在 **后端代码** 和 [**前端代码**](#控制前端程序) 中使用这个开关，两者相互独立，您可以根据需要选择阅读您感兴趣的部分。
:::



## 控制后端程序

我们提供一个后端的代码示例，你可以从这里开始体验后端代码如何使用开关。

### 编写代码 {#backend-code}

1. 按你熟悉的语言，下载并打开相应的后端示例代码

<Tabs groupId="language">
  <TabItem value="java" label="Java" default>

~~~bash
bash:> git clone https://gitee.com/FeatureProbe/server-sdk-java.git
bash:> cd server-sdk-java
~~~
用编辑器打开`src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java`文件。

  </TabItem>
  <TabItem value="golang" label="Go">

~~~bash
bash:> git clone https://gitee.com/FeatureProbe/server-sdk-go.git
bash:> cd server-sdk-go
~~~
用编辑器打开`example/main.go`文件。
  </TabItem>
  <TabItem value="rust" label="Rust">

~~~bash
bash:> git clone https://gitee.com/FeatureProbe/server-sdk-rust.git
bash:> cd server-sdk-rust
~~~
用编辑器打开`examples/demo.rs`文件。
  </TabItem>
  <TabItem value="python" label="Python">

~~~bash
bash:> git clone https://gitee.com/FeatureProbe/server-sdk-python.git
bash:> cd server-sdk-python
~~~
用编辑器打开`demo.py`文件。
  </TabItem>
</Tabs>

2. 打开FeatureProbe平台[项目列表页面](https://featureprobe.io/projects)， 可以在开关详情页点击`服务`来打开
![project](/tutorial_click_project_cn.png)
3. 复制`服务端SDK密钥`
![sdk key](/tutorial_rollout_server_sdk_key_cn.png)
4. 将`服务端SDK密钥`以及`FeatureProbe网址` ("https://featureprobe.io/server") 填入后端代码相应变量中

<Tabs groupId="language">
   <TabItem value="java" label="Java" default>

~~~java title="src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java"
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
</Tabs>

5. 加入以下代码，模拟100个用户访问这个开关

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
		ServerSdkKey:    // 填入 服务端SDK密钥,
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
    FEATURE_PROBE_SERVER_SDK_KEY = # 填入 服务端SDK密钥;

    config = fp.Config(remote_uri=FEATURE_PROBE_SERVER_URL,  # FeatureProbe server URL
                       sync_mode='pooling',
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
</Tabs>

6. 运行编辑后的服务端程序

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

### 验证结果
从命令行log可以看到，有大约10%的用户进入了开关，也就是拿到了返回值true。
<details>
  <summary>log示例</summary>

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
每次运行程序，进入开关的用户可能是不同的，如果需要同样id用户总是拿到相同的开关结果，需要[使用FPUser的stableRollout接口](stable_rollout_tutorial.md)。
:::

可以回到平台的开关设置页面，调整灰度比例，然后重新运行服务端程序，看看log内进入开关的比例是否有变化。

## 控制前端程序

我们提供一个前端的js代码示例，你可以从这里开始体验前端代码如何使用开关。

### 编写代码 {#frontend-code}

1. 下载示例代码

~~~bash
bash:> git clone https://gitee.com/FeatureProbe/client-sdk-js.git
bash:> cd client-sdk-js
~~~

2. 打开[平台](https://featureprobe.io/projects)获取client sdk key
:::info
点击『服务』Tab，可以进入『服务』列表，获取各类SDK key，以及修改服务和环境信息。
:::
![client sdk key](/tutorial_client_sdk_key_cn.png)

3. 打开 `example/index.html` 填入 `客户端SDK密钥` 以及 `FeatureProbe网址`  ("https://featureprobe.io/server")

~~~js title="example/index.html"
      const fpClient = new featureProbe.FeatureProbe({
  //      highlight-start
        remoteUrl: "https://featureprobe.io/server",
        clientSdkKey: // Paste client sdk key here,
  //      highlight-end
        user,
        refreshInterval: 5000,
      });
~~~

4. 模拟当前用户访问开关 `tutorial_rollout` ，直接获取开关状态

~~~js title="example/index.html"
  <script>
  //      highlight-next-line
    const user = new featureProbe.FPUser();
    const fpClient = new featureProbe.FeatureProbe({
      remoteUrl: "https://featureprobe.io/server",
      clientSdkKey:  // Paste client sdk key here,
      user,
      refreshInterval: 5000,
    });
  
    fpClient.start();
    fpClient.on("ready", function() {
  //      highlight-start
      const boolValue = fpClient.boolValue("tutorial_rollout", false);
      document.getElementById("boolean-result").innerText = boolValue;
  //      highlight-end
    });
  </script>
~~~

### 验证结果

浏览器打开 `index.html` , 手动刷新页面（模拟用户多次访问），可以看到页面按配置的比例可以获得 `true` 或 `false` 的返回值。

<details>
  <summary>页面展示示例</summary>
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

可以回到平台的开关设置页面，调整灰度比例，然后重新刷新页面，看看拿到的 `true`/`false` 比例是否有变化。

:::tip
如果希望对同一个用户，不管他如何刷新，总是被灰度到。需要[使用FPUser的stableRollout接口](stable_rollout_tutorial.md)，传入用户的唯一ID。
:::