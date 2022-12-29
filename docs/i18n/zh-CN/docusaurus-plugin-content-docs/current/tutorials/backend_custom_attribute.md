---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 给不同用户展示不同信息

我们将带领你使用FeatureProbe的平台创建一个按用户特性控制的开关。然后我们编写一个后端程序，验证后端程序拿不同的用户信息请求FeatureProbe SDK，会拿到不同的结果。

假定我们要实现以下场景：

* 对于『上海』的『钻石』用户，显示『欢迎上海的尊贵客户』
* 对于『北京』的用户（不区分级别），显示『欢迎北京的客户』
* 对于不满足以上两点的用户，显示『欢迎』

## 在平台创建开关

1. 登录我们提供的FeatureProbe[演示平台](https://featureprobe.io)，如果是第一次登录，请输入邮箱。后续可以继续使用你的邮箱访问到属于你的数据。
2. 点击`+开关`新建一个开关
* 填入名称和标识
* 选择string类型作为返回值
* 添加3个分组，分别将名称和值填入，值就是我们要返回的三个不同的提示语
* 选择开关未生效时的默认返回的分组
* 点击`创建`

![create toggle](/tutorial_variation_create_cn.png)

3. 点击进入新创建的`tutorial_variation`开关的详情页面

* 点击`+ 增加规则`
* 规则中增加两个条件，city是上海，以及rank是钻石
* 返回值选择为variation1（即值为：欢迎上海的尊贵客户）

![rule one](/tutorial_variation_rule1_cn.png)
* 再次点击`+ 增加规则`
* 规则中增加条件，city是北京，返回值选择为variation2

![rule two](/tutorial_variation_rule2_cn.png)

* 默认规则的返回值选择为variation3

![default](/tutorial_variation_default_rule_cn.png)

* 开关状态改为`生效`，点击下方`发布`
 
![publish](/tutorial_variation_publish_cn.png)

* 点击`确认`，发布开关。

![confirm](/tutorial_variation_confirm_cn.png)

4. 此时应当看到`发布成功`的提示

![publish success](/tutorial_variation_publish_success_cn.png)

在平台的操作到这里就结束了，开关已经创建成功，并且可以访问了。下面我们介绍怎么在程序中通过SDK拿到这些配置值。

## 控制后端程序

我们提供一个后端的代码示例，你可以从这里开始体验后端代码如何使用开关。

### 编写代码

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
</Tabs>

5. 加入以下代码，模拟5个用户访问这个开关
    1. 上海的钻石用户
    2. 上海的黄金用户
    3. 北京的钻石用户
    4. 北京的黄金用户
    5. 天津的钻石用户

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
            new FPUser().with("city", "上海").with("rank", "钻石"),
            new FPUser().with("city", "上海").with("rank", "黄金"),
            new FPUser().with("city", "北京").with("rank", "钻石"),
            new FPUser().with("city", "北京").with("rank", "黄金"),
            new FPUser().with("city", "天津").with("rank", "钻石"),
        };
    
        for (FPUser user:users) {
            String greeting = fpClient.stringValue("tutorial_variation", user, "欢迎您");
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
	users := []featureprobe.FPUser{
		featureprobe.NewUser().With("city", "上海").With("rank", "钻石"),
		featureprobe.NewUser().With("city", "上海").With("rank", "黄金"),
		featureprobe.NewUser().With("city", "北京").With("rank", "钻石"),
		featureprobe.NewUser().With("city", "北京").With("rank", "黄金"),
		featureprobe.NewUser().With("city", "天津").With("rank", "钻石"),
	}

	for _, user := range users {
		greeting := fp.StrValue("tutorial_variation", user, "你好啊")
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
    let users = [
        FPUser::new().with("city", "上海").with("rank", "钻石"),
        FPUser::new().with("city", "上海").with("rank", "黄金"),
        FPUser::new().with("city", "北京").with("rank", "钻石"),
        FPUser::new().with("city", "北京").with("rank", "黄金"),
        FPUser::new().with("city", "天津").with("rank", "钻石")
    ];
    for user in users {
        let greeting = fp.string_value("tutorial_variation", &user, "你好啊".to_string());
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
    FEATURE_PROBE_SERVER_SDK_KEY = # 填入 服务端SDK密钥;

    config = fp.Config(remote_uri=FEATURE_PROBE_SERVER_URL,  # FeatureProbe server URL
                       sync_mode='pooling',
                       refresh_interval=3)

    with fp.Client(FEATURE_PROBE_SERVER_SDK_KEY, config) as client:
      # highlight-start
      users = [
         fp.User().with_attr("city", "上海").with_attr("rank", "钻石"),
         fp.User().with_attr("city", "上海").with_attr("rank", "黄金"),
         fp.User().with_attr("city", "北京").with_attr("rank", "钻石"),
         fp.User().with_attr("city", "北京").with_attr("rank", "黄金"),
         fp.User().with_attr("city", "天津").with_attr("rank", "钻石")
      ]
      for user in users:
         greeting = client.value('tutorial_variation', user, default="你好")
         print(greeting)
      # highlight-end
~~~
</TabItem>
</Tabs>

:::tip
用户的属性（例如：所在城市、帐号级别）需要开发者通过其他方式在业务代码中获取到，然后通过With方法传入FeatureProbe SDK。 SDK只负责将规则应用到这些用户上，
SDK无法在内部自己推断出用户的属性。
:::

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
从命令行log可以看到，对于以下五个测试用户

> 1. 上海的钻石用户
> 2. 上海的黄金用户
> 3. 北京的钻石用户
> 4. 北京的黄金用户
> 5. 天津的钻石用户

应用了规则

> * 对于『上海』的『钻石』用户，显示『欢迎上海的尊贵客户』
> * 对于『北京』的用户（不区分级别），显示『欢迎北京的客户』
> * 对于不满足以上两点的用户，显示『欢迎』

之后，拿到了以下结果

~~~bash
欢迎上海的尊贵客户
欢迎
欢迎北京的客户
欢迎北京的客户
欢迎
~~~

可以更改代码，尝试更多用户属性组合，看看log中显示的结果是否符合条件。

## 控制前端程序

我们提供一个前端的js代码示例，你可以从这里开始体验前端代码如何使用开关。

### 编写代码

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

4. 模拟『上海』的『钻石』用户访问开关 `tutorial_variation` ，直接获取开关状态

~~~js title="example/index.html"
  <script>
  //      highlight-next-line
    const user = new featureProbe.FPUser().with("city", "上海").with("rank", "钻石");
    const fpClient = new featureProbe.FeatureProbe({
      remoteUrl: "https://featureprobe.io/server",
      clientSdkKey:  // Paste client sdk key here,
      user,
      refreshInterval: 5000,
    });
  
    fpClient.start();
    fpClient.on("ready", function() {
  //      highlight-start
    const stringValue = fpClient.stringValue("tutorial_variation", "欢迎");
    document.getElementById("string-result").innerText = stringValue;
  //      highlight-end
    });
  </script>
~~~

### 验证结果

浏览器打开 `index.html` , 可以看到对与当前这个『上海』的『钻石』用户，显示了『欢迎上海的尊贵客户』。

~~~
string type
FeatureProbe evaluation string type toggle result is : 欢迎上海的尊贵客户
~~~

可以回到 `index.html` 文件，然后更新 `with` 参数，看看返回值有什么差别。

~~~ js title="example/index.html"
const user = new featureProbe.FPUser().with("city", "北京").with("rank", "钻石");
~~~
