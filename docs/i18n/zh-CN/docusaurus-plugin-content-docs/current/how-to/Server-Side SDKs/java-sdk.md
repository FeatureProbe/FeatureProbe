---
sidebar_position: 1
---

# Java SDK

本文介绍如何在一个 Java 项目中使用 FeatureProbe SDK。

:::note SDK quick links
除了本参考指南外，我们还提供源代码、API 参考文档和示例应用程序，相关链接如下所示：

| **Resource**        | **Location** |
| --------------------------------------- | ----------------- |
| SDK API 文档 | [ SDK API docs](https://featureprobe.github.io/server-sdk-java/) |
| GitHub 代码库 | [Server-SDK for Java](https://github.com/FeatureProbe/server-sdk-java) |
| 接入示例 | [FeatureProbeDemo](https://github.com/FeatureProbe/server-sdk-java/blob/main/src/main/java/com/featureprobe/sdk/example/FeatureProbeDemo.java) (Java) |
|已发布模块|[Maven](https://mvnrepository.com/artifact/com.featureprobe/server-sdk-java)|

:::



:::tip
对于首次使用FeatureProbe的用户，我们强烈建议你在阅读过[灰度放量教程](../../tutorials/rollout_tutorial/)之后，再回到这篇文章继续阅读。
:::

## 接入业务代码

后端项目通常只需要实例化一个FeatureProbe SDK（Client）。
然后针对不同用户的请求，调用FeatureProbe Client获取对每一个用户的开关处理结果。

:::info
服务端SDK采用异步连接FeatureProbe服务器拉取判定规则的方式，判定规则会在本地存缓。所有对用户代码暴露的接口都只涉及内存操作，调用时不必担心性能问题。
:::

### 步骤 1. 安装 FeatureProbe SDK

首先，在您的应用程序中安装 FeatureProbe SDK 作为依赖项。

#### Apache Maven

```xml
<dependency>
    <groupId>com.featureprobe</groupId>
    <artifactId>server-sdk-java</artifactId>
    <version>1.4.0</version>
</dependency>
```

#### Gradle Groovy DSL

```text
implementation 'com.featureprobe:server-sdk-java:1.4.0'
```

### 步骤 2. 创建一个 FeatureProbe instance

安装并导入 SDK 后，创建 FeatureProbe sdk 的单个共享实例。

```java
public class Demo {
    private static final FPConfig config = FPConfig.builder()
        .remoteUri(/* FeatureProbe Server URI */)
        .build();

    private static final FeatureProbe fpClient = new FeatureProbe(
        /* FeatureProbe Server SDK Key */, config);
  
  	if（!fpClient.initialized()) {
				System.out.println("SDK failed to initialize!")
		}
}
```

### 步骤 3. 使用 FeatureProbe 开关获取设置的值

您可以使用 sdk 拿到对应开关名设置的值。

```java
FPUser user = new FPUser();
    user.with("ATTRIBUTE_NAME_IN_RULE", VALUE_OF_ATTRIBUTE);    // Call with() for each attribute used in Rule.
    boolean boolValue = fpClient.boolValue("YOUR_TOGGLE_KEY", user, false);
    if (boolValue) {
    // the code to run if the toggle is on
    } else {
    // the code to run if the toggle is off
    }
```

### 步骤 4. 程序退出前关闭 FeatureProbe Client

退出前关闭client，保证数据上报准确。

```java
fpClient.close();
```

## 接入业务单元测试

FeatureProbe SDK 提供了一套mock机制，可以在单元测试中指定FeatureProbe SDK的返回值。

### 1. 项目中添加 powermock SDK:

```xml
<dependency>
    <groupId>org.powermock</groupId>
    <artifactId>powermock-api-mockito2</artifactId>
    <version>2.0.9</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.powermock</groupId>
    <artifactId>powermock-module-junit4</artifactId>
    <version>2.0.9</version>
    <scope>test</scope>
</dependency>
```

### 2. Mock FeatureProbe开关

#### 被测函数

```java
@AllArgsConstructor
@Service
public class DemoService {

    FeatureProbe fp;

    public boolean businessFunction(String userId, String tel) {
        FPUser fpUser = new FPUser(userId);
        fpUser.with("tel", tel);
        return fp.boolValue("is_tester", fpUser, false);
    }
}
```
#### 单测Code

```java
@RunWith(PowerMockRunner.class)
@PrepareForTest({FeatureProbe.class})
public class FeatureProbeTest {

    @Test
    public void test() {
        FeatureProbe fp = PowerMockito.mock(FeatureProbe.class);
        DemoService demoService = new DemoService(fp);
        Mockito.when(fp.boolValue(anyString(), any(FPUser.class), anyBoolean())).thenReturn(true);
        boolean tester = demoService.businessFunction("user123", "12397347232");
        assert tester;
    }

}
```

## 定制化开发本SDK

:::tip
本段落适用于想自己定制化开发本SDK，或者通过开源社区对本SDK贡献代码的用户。一般用户可以跳过此段内容。
:::

我们提供了一个本SDK的验收测试，用于保证修改后的SDK跟FeatureProbe的原生规则兼容。
集成测试用例作为每个 SDK 存储库的子模块添加。所以在运行测试之前，请务必先拉取子模块以获取最新的集成测试。

```shell
git submodule update --init --recursive
mvn test
```
