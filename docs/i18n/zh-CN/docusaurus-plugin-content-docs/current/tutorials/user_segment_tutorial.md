---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# 使用人群组

人群组是可以在多个开关中共享的人群过滤规则。
我们将带领你使用FeatureProbe的平台创建一个人群组，然后在两个开关中使用这个人群组。并且通过一个后端程序，验证人群组的修改会同时在两个开关中生效。

假定我们要实现以下场景：
* 有一个由测试人员email组成的白名单，需要在多个开关中使用。以便这组测试人员可以测试多个开关。
* 这个测试人员白名单需要统一修改，添加的新测试人员可以在多个开关中生效。

## 在平台创建人群组

1. 登录我们提供的FeatureProbe[演示平台](https://featureprobe.io)，如果是第一次登录，请输入邮箱。后续可以继续使用你的邮箱访问到属于你的数据。
2. 点击`人群组/+人群组`新建一个新的人群

![create segment](/tutorial_create_segment_cn.png)

3. 填入名称和标识，点击 `创建并发布`

![publish segment](/tutorial_publish_segment_cn.png)

4.从列表中点击新创建的人群组，进入编辑。

![segment_list_cn.png](/tutorial_segment_list_cn.png)

5. 添加一个规则，选择类型，输入属性`email`，
* 选择`string`类型
* 规则`是其中之一`
* 然后输入两个测试人员email
* 点击`发布`

![tutorial_segment_detail_cn.png](/tutorial_segment_detail_cn.png)
6. 此时还没有开关使用这个『用户组』，这里直接点击`下一步`，并且`确认`变更。

![tutorial_segment_publish_next_step_cn.png](/tutorial_segment_publish_next_step_cn.png)

## 在开关中使用人群组

下面，我们来到`开关`列表，创建两个开关都使用以上创建的人群组`qa_email`

1. 创建一个返回值为bool型的开关`feature1`，使用默认配置即可，然后点击`创建并发布`

![tutorial_toggle_create_use_segment_cn.png](/tutorial_toggle_create_use_segment_cn.png)

2. 进入开关`feature1`的编辑页面，状态改为`生效`，点击`+ 增加规则`，选择`人群组`规则

![tutorial_toggle_use_segment_add_rule_cn.png](/tutorial_toggle_use_segment_add_rule_cn.png)

3. 编辑规则 
* 选择`属于人群组`
* 选择`测试人员email`人群组
* 为人群组设置返回值`variation2`
* 其余返回规则设置返回值`variation1`

![tutorial_toggle_use_segment_rule_detail_cn.png](/tutorial_toggle_use_segment_rule_detail_cn.png)

4. 发布开关`feature1`
5. 重复以上步骤1-4，创建另一个使用相同人群组的开关`feature2`

## 代码访问验证人群组

### 后端代码编写

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
<TabItem value="nodejs" label="Node.js">

~~~bash
git clone https://github.com/FeatureProbe/server-sdk-node.git
cd server-sdk-node
~~~
Open `example/demo.js` file with an editor.

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
<TabItem value="nodejs" label="Node.js">

~~~js title="demo.js"
const FEATURE_PROBE_SERVER_URL = 'https://featureprobe.io/server';
const FEATURE_PROBE_SERVER_SDK_KEY = // Fill in the server SDK key
~~~
</TabItem>
</Tabs>

5. 加入以下代码，模拟3个带email属性的用户访问这2个开关

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
    FEATURE_PROBE_SERVER_SDK_KEY = # 填入 服务端SDK密钥;

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
除了Toggle的规则中显式用到的用户属性需要通过with方法传入SDK，Toggle中所使用的人群组中需要用到的用户属性（例如：email），也需要通过with方法传入FeatureProbe SDK。
:::

### 运行验证

运行编辑后的服务端程序

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
<TabItem value="nodejs" label="Node.js">

~~~bash
node example/demo.js
~~~
</TabItem>
</Tabs>

查看log验证结果，可以看到人群组中的两个测试email(tester_a和tester_b)能够看到两个新feature，而不在人群组中的email(tester_c)则看不到。

~~~bash
tester_a@company.com see the new feature1
tester_b@company.com see the new feature1
tester_c@company.com see nothing
tester_a@company.com see the new feature2
tester_b@company.com see the new feature2
tester_c@company.com see nothing
~~~

## 更新人群组

下面我们更新一下人群组的规则，然后验证更新结果可以同时在两个toggle上生效。

### 页面上更新人群组

1. 进入人群组`qa_email`的编辑页面
2. 将email帐号`test_b`删除，添加email帐号`test_c`

![tutorial_segment_after_update_cn.png](/tutorial_segment_after_update_cn.png)

3. 发布人群组

### 重新运行程序查看结果

按以上[运行方法](#运行验证)再次运行程序，查看log

~~~bash
tester_a@company.com see the new feature1
tester_b@company.com see nothing
tester_c@company.com see the new feature1
tester_a@company.com see the new feature2
tester_b@company.com see nothing
tester_c@company.com see the new feature2
~~~

可以看到修改在两个开关上都生效了。